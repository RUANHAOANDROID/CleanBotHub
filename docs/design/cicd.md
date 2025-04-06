# CI/CD

Drone 和 Woodpecker (区别很小) 插件可共用功能完备。

自定义插件非常简单,也可结合脚本。

可以在K8s集群中运行,Docker中运行以及本地运行。
那么也就意味着我们可以从Docker阶段出发最终过渡到K8s集群

当然我们也可以选择GitHub Actions 或 AWS CodePipeline,他们在原理上是相通的

## 部署

为方便构建,这是我的服务器中的docker-compose文件,可以直接使用验证
> 替换到实际使用的git

``` bash
``` yaml
services:
  drone:
    container_name: drone
    restart: unless-stopped
    image: drone/drone:2.26.0
    networks:
      - dev
    ports:
      - "3030:80"
    volumes:
      - /mnt/user/appdata/drone:/var/lib/drone/
      - /mnt/user/appdata/drone/data:/data/
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
    environment:
      - DRONE_GITEA_SERVER=http://192.168.8.6:3000/ # Gitea访问地址
      - DRONE_GITEA_CLIENT_ID=48b30a9b-359c-4de2-8f5d-fce26e99539a # 应用ID
      - DRONE_GITEA_CLIENT_SECRET=gto_tr2o7pe6zn6y7ke75bxzlzteiy763q2xwjbbyib5bvfnxm2rmn6a # 应用密钥
      - DRONE_SERVER_HOST=http://192.168.8.6:3030
      - DRONE_SERVER_PROTO=http # 支持http, https
      - DRONE_RPC_SECRET=7cc96b3ca902a735958033cb233abb6e # 通信密钥,下一步会获取
      - DRONE_GIT_ALWAYS_AUTH=true
      - DRONE_GIT_USERNAME=hao88 # git用户名
      - DRONE_GIT_PASSWORD=Hao88.dev! # git密码
      - DRONE_USER_CREATE=username:hao88,admin:true # 管理员用户名,开启管理员账户
      - DRONE_DEBUG=true
      - DRONE_TRACE=true
      - DRONE_DATABASE_DRIVER=postgres
      - DRONE_DATABASE_DATASOURCE=postgres://hao88:Hao88.dev!@192.168.8.6:5432/dronecicd?sslmode=disable
      - TZ=Asia/Shanghai
    # depends_on: # 添加依赖关系
    #   - gitea
  drone-runner:
    container_name: drone-runner
    restart: unless-stopped
    image: drone/drone-runner-docker:1.8
    networks:
      - dev
    ports:
      - "3031:3000"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
    environment:
      - DRONE_RPC_PROTO=http # 支持http, https
      - DRONE_RPC_HOST=drone
      - DRONE_RPC_SECRET=7cc96b3ca902a735958033cb233abb6e # 通信密钥,下一步会获取
      - DRONE_RUNNER_NAME=drone-runner-docker
      - DRONE_RUNNER_CAPACITY=2 # 同时运行的流水线个数
      - TZ=Asia/Shanghai
      - DRONE_DEBUG=true
      - DRONE_TRACE=true
    depends_on:
      - drone
networks:
  dev:
    name: dev
    driver: bridge
    external: true
```

## 示例

取自我的云原生混合项目,自动构建和推送多架构镜像到Docker Hub,然后进一不实施

```yaml
kind: pipeline
type: docker
name: default
trigger:
  branch:
    #- dev
    - master
steps:
  - name: build_push
    image: docker:dind
    volumes:
      - name: docker
        path: /var/run/docker.sock
    environment:
      DOCKER_BUILDKIT: 1
      DOCKER_USER:
        from_secret: DOCKER_USER
      DOCKER_PWD:
        from_secret: DOCKER_PWD
    commands:
      - docker --version
      - docker login -u "$DOCKER_USER" -p "$DOCKER_PWD".    # login to docker hub
      - docker buildx create --name aBuildX --use      # Create and use a Buildx builder
      - docker buildx build --platform linux/amd64,linux/arm64 -f Dockerfile -t hao88/wgmserver:amd64 -t hao88/wgmserver:arm64 --push . # Build and push multi-arch images
      - docker buildx rm aBuildX  # Remove the Buildx builder
volumes:
  - name: docker
    host:
      path: /var/run/docker.sock

```

## Graph

```mermaid
graph TD
    A[机器人] -->|HTTPS| B[API Gateway]
    B -->|负载均衡| C1[Webhook Pod 1]
    B --> C2[Webhook Pod N]
    
    subgraph Kubernetes Cluster
        C1 -->|异步写入| D[(Kafka Topic)]
        C2 --> D
        
        subgraph "Flink Job (Stateful Processing)"
            E[Flink TaskManager]
            E -->|本地状态| F1[(RocksDB Pod 1)]
            E -->|Checkpoint| F2[(S3/MinIO)]
        end
        
        D --> E
        D --> G[AI Consumer Group]
        
        F1 -->|增量CK| F2
        F2 -.->|故障恢复| E
        
        %% ========= 新增Drone组件 =========
        subgraph "CI/CD Automation"
            M[Drone Server]
            N[Drone Runner]
            O[镜像仓库]
        end
        
        M -->|部署指令| K[Robot Command Service]
        M -->|更新配置| B
        N -->|构建镜像| O
        O -->|拉取| C1
        O -->|拉取| C2
        %% ==============================
    end
    
    B --> H[Redis Cache]
    C1 --> H
    I[Prometheus] -->|监控指标| J[Horizontal Pod Autoscaler]
    J --> C1
    J --> C2
    I -->|状态监控| E

    %% 外部系统连接
    K -->|获取机器人列表| L[Robot Platform]
    K -->|发送命令和任务| A
    K --> B

    %% 代码仓库触发
    P[Git仓库] -->|Webhook| M
```