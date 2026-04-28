# Fake Owner

## 背景

`tx_context::sender` 才代表真实调用者。

## 漏洞

函数信任调用者传入的 `claimed_owner`，而不是检查交易 sender。

## 目标

传入实例 owner 地址设置 restricted flag，然后完成 solve。

