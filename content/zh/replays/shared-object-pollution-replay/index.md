# Shared Object 污染复盘

本复盘对应 Challenge 02，说明 shared object 的 owner 字段不等于授权检查。

核心审计点：每个 shared object mutation 是否校验 sender 或 capability。
