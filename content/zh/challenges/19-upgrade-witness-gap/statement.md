# Challenge 19：升级 Witness 缺口

## 背景

升级后旧 witness、旧 authority 或旧 capability 如果仍可使用，会让修复后的路径被绕开。

## 漏洞

本题保留了旧 witness 的使用路径。用户可以先铸造旧 witness，再用它执行新版本本应拒绝的动作。

## 目标

领取实例，获得旧 witness，使用它触发旧权限路径，然后提交 solve。

## CLI / PTB 练习

检查旧对象是否被废弃、是否仍能参与入口函数调用，以及 solve 是否依赖旧状态。
