## 网关故障转移

```mermaid
graph LR
    A[主网关集群] -->|BGP VIP| B[Cloud Provider LB]
    C[备网关集群] --> B
    B --> D[健康检查]
    D -.->|主集群故障| C
```