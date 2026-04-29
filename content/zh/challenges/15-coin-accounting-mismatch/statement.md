# Challenge 15：Coin 记账不一致

## 背景

资产系统要保证实际 coin、内部 credit 和用户余额三者一致。只更新其中一部分会造成账实不符。

## 漏洞

本题用简化模型展示内部 credit 与实际 deposit 不匹配。调用者可以制造大于实际资金的记账余额。

## 目标

领取实例，构造记账不一致状态，让 credits 超过 deposits，然后提交 solve。

## CLI / PTB 练习

重点比较对象字段里的 `deposits` 和 `credits`，并思考哪些入口只改账本不改资产。
