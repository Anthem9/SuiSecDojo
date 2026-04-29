# Challenge 17：动态字段 Shadow

## 背景

动态字段适合扩展对象状态，但 key、namespace 和类型必须设计清楚。否则攻击者可能写入“看起来相同”的 shadow 字段。

## 漏洞

本题允许调用者写入与可信 key 混淆的 shadow key。合约后续读取状态时会把被污染的字段当作有效信号。

## 目标

领取实例，写入 shadow key，让 `shadow_written` 成立，然后提交 solve。

## CLI / PTB 练习

重点观察 trusted key 与 shadow key 的差异，以及动态字段是否有统一命名空间。
