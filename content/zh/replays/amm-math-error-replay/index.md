# AMM 数学错误复盘

本复盘对应 Challenge 06 和 Challenge 10，说明舍入方向、reserve 更新顺序和 invariant 检查为什么重要。

核心审计点：小额重复操作、边界值、状态更新顺序、每次交易后的 invariant。

