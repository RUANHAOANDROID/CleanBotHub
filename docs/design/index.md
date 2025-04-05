# 前言

架构总是一边摸索要解决的问题，一边摸索解决方案(<架构师修炼之道>).    
在这个过程中，设计的架构会随着需求的变化而变化.

## 背景

正在实施构建清洁机器人实时的网络应用程序,直接与机器人制造厂商的API服务进行交互,并将数据存储的到数据库中.希望能够通过微服务架构改进程序,以更好的处理实时数据,提供更友好可靠的体验.

## 目标

根据已知的细节和问题,进一步明确目标

- 通过微服务架构,将数据处理和存储分离,提高系统的可扩展性和可靠性.
- Webhook服务作为数据接入点,实现数据的异步处理.
- Reboot Control服务与机器人平台交互列出清洁机器人以及下发作业任务.
- 使用Kafka作为消息队列,实现数据的异步处理,提高系统的吞吐量.
- 使用Flink进行状态处理,实现数据的实时处理和分析.
- 使用K8s作为容器编排平台,实现系统的自动化部署和管理.
- 使用Redis作为缓存,提高系统的性能.
- 使用Prometheus进行监控,实现系统的可观测性.
- 使用Grafana进行可视化,实现系统的可视化监控.
- 使用S3/MinIO作为存储,实现数据的持久化.
- 使用RocksDB作为本地状态存储,实现数据的容灾和重放.
- 使用API Gateway作为统一入口,实现系统的安全性和可扩展性.

## 架构设计

微服务本身不关心开发者的开发语言,更关心服务的接口和协议,根据以上背景和目标,我们从本地docker环境开始,逐步扩展到K8s集群,并最终实现分布式微服务架构.

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
    end
    
    B --> H[Redis Cache]
    C1 --> H
    I[Prometheus] -->|监控指标| J[Horizontal Pod Autoscaler]
    J --> C1
    J --> C2
    I -->|状态监控| E

    %% 新增的机器人命令服务
    K[Robot Command Service] -->|获取机器人列表| L[Robot Platform]
    K -->|发送命令和任务| A
    K --> B

```

## 演进

接下来我们将逐步实现这个架构

```mermaid
timeline
    title 架构演进时间轴
    section 第一阶段
        Local验证 : Kafka基础消息流
    section 第二阶段
        Minikube : 基础K8s能力验证
    section 第三阶段
        过渡架构 : 核心组件HA
    section 最终阶段
        生产架构 : 全组件上线
```