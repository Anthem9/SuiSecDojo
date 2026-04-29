# Challenge 04：泄露的 Capability

## 背景

Sui Move 常用 capability 对象表达权限，例如 `AdminCap` 代表管理员能力。安全设计里，敏感入口应要求调用者持有正确 capability，而不是信任一个地址参数。

## 漏洞

本题故意暴露了一个公开入口，允许任意调用者领取自己实例里的 `AdminCap`。一旦 capability 泄露，用户就可以执行原本只该由管理员触发的状态变更。

## 目标

领取实例，拿到泄露的 `AdminCap`，用它设置受保护标记，然后提交 solve。

## CLI / PTB 练习

默认先使用挑战模式：查看实例对象、capability 对象和入口函数签名，再自己构造交易。`solve` 需要额外传入 `mode` 和 `assistance_level` 作为评分参数。
