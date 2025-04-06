---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "CleanBot Hub"
  text: "云原生机器人中枢平台"
  tagline: "智能服务机器人混合云管理平台设计"
  actions:
    - theme: brand
      text: Architecture & Selection
      link: /design/
    - theme: alt
      text: Robot Control API Server
      link: /design/server-control
    - theme: alt
      text: Webhook Server
      link: /design/server-webhook
    - theme: alt
      text: CI/CD
      link: /design/cicd
      
features:

  - icon: 🏗️
    title: 基于微服务架构
    #details: 系统采用微服务架构，各个服务（如 Webhook 服务和 Reboot Command Service）可以独立扩展和维护，确保高可用性与可伸缩性。
    #link: /microservices/

  - icon: 🔄
    title: 异步消息处理
    #details: Webhook 服务通过 Kafka 实现异步消息处理，确保高效的任务流转和可靠的数据传输，即使在高并发环境下也能稳定运行。
    #link: /asynchronous/

  - icon: 🔐
    title: 高度安全性
    #details: 系统通过 HTTPS、签名验证以及权限控制，保障数据传输和操作命令的安全性，防止恶意攻击和数据篡改。
    #link: /security/

  - icon: 📈
    title: 动态扩展与容错
    #details: 通过 Kubernetes 的水平扩展和自动伸缩功能，系统能够根据负载变化自动增加或减少 Pod 数量，确保系统在高负载时也能稳定运行。
    #link: /scalability/

  - icon: 📊
    title: 实时监控与日志记录
    #details: 系统集成 Prometheus 和日志记录系统，实时监控服务状态、任务执行情况和系统健康，及时响应潜在的故障或性能瓶颈。
    #link: /monitoring/

  - icon: 🤖
    title: 机器人任务管理与控制
    #details: 机器人控制服务能够获取机器人列表并下发任务，还能注册 webhook，允许机器人与外部系统进行交互，自动执行命令并进行状态反馈。
    #link: /robot-management/
footer: true
---


