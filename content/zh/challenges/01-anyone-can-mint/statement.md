# Anyone Can Mint

## 背景

铸币权限应由 capability 控制。

## 漏洞

示例合约暴露了没有权限检查的 mint 路径，任何调用者都能增加实例中的 minted amount。

## 目标

领取实例，利用 mint 路径让数量达到 solve 阈值，然后完成题目。

