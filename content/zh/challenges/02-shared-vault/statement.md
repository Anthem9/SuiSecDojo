# Shared Vault

## 背景

Shared object 可以被多人访问，因此每个状态修改入口都必须定义授权规则。

## 漏洞

Vault 存在 owner 字段，但 withdraw 没有检查调用者是否为 owner。

## 目标

领取实例，清空 vault 的模拟余额，然后调用 solve。

