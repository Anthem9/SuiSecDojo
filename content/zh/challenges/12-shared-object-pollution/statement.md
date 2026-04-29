# Challenge 12：共享对象污染

## 背景

共享对象需要清晰的权限边界。任何人都能访问 shared object，并不代表任何人都应该能写入关键状态。

## 漏洞

本题的 shared object 暴露了过宽的写入口，外部调用者可以污染实例状态，使后续判题条件成立。

## 目标

领取实例，写入污染状态，让污染计数或标记达到 solve 条件，然后提交 solve。

## CLI / PTB 练习

重点检查 shared object 的可写入口是否验证了 sender、owner 或 capability。
