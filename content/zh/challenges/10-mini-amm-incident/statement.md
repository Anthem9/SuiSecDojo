# Challenge 10：迷你 AMM 事件

## 背景

AMM 的 reserve、LP 份额和 invariant 更新顺序必须严谨。错误的计算顺序可能让用户获得异常收益，或破坏池子的恒定关系。

## 漏洞

本题用最小化 AMM 模型展示 reserve 更新顺序问题。特定 swap 参数会导致攻击者利润异常或 invariant 被破坏。

## 目标

领取实例，执行边界 swap，让 `invariant_broken` 或收益条件满足，然后提交 solve。

## CLI / PTB 练习

先推导输入金额对 reserve 的影响，再决定交易参数。不要把它理解成真实协议 exploit。
