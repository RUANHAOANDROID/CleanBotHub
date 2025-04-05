# AWS 方案

``` mermaid
graph TD
    A[机器人] -->|HTTPS 15s/次| B(Amazon ALB)
    B -->|健康检查| C1[EC2 Auto Scaling Group]
    B --> C2[EC2 Auto Scaling Group]
    C1 --> D1[Webhook实例-AZ1]
    C2 --> D2[Webhook实例-AZ2]
    
    subgraph AWS区域
        B -->|会话保持| Sticky[ALB粘性会话]
        Sticky -.->|Cookie| D1
        Sticky -.->|Cookie| D2
    end
    
    D1 -->|异步写入| E1[(Amazon SQS)]
    D2 -->|异步写入| E1
    E1 --> F[Lambda处理器]
    F --> G[(DynamoDB)]
    F --> H[(Amazon S3)]
    
    I[CloudWatch] -->|监控指标| J[Auto Scaling策略]
    J -->|Scale-Out| C1
    J -->|Scale-Out| C2
```
