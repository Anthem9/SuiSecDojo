# Capability 泄露复盘

本复盘对应 Challenge 04 和 Challenge 05，说明 AdminCap 创建路径、转移路径和初始化生命周期的风险。

核心审计点：capability 构造函数是否公开、是否可重复初始化、普通用户是否能获得管理能力。

