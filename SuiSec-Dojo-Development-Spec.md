# SuiSec Dojo 开发文档

## 0. 项目命名

### 0.1 产品名称

**SuiSec Dojo**

中文名可使用：

- SuiSec 道场
- Sui 安全道场
- Sui Move 安全修炼场

推荐正式表达：

> **SuiSec Dojo：一个由 Walrus 驱动的 Sui Move 安全训练场。**

英文副标题：

> **A Sui Move Security Training Ground powered by Walrus.**

---

### 0.2 为什么叫 Dojo

`Dojo` 本义是“道场”，常用于武术、修行、训练、长期练习的语境。

放到开发者安全教育里，`Security Dojo` 传达的是：

> 一个持续训练、反复练习、从入门到进阶的安全修炼场。

本项目不只是一次 CTF 比赛，也不只是简单的漏洞题库，而是希望包含：

- Sui Move 安全训练
- Sui 安全最佳实践
- 历史漏洞事件复盘
- Walrus 知识库
- 链上学习凭证
- 长期学习路线

因此主名使用 **SuiSec Dojo** 更合适。

---

### 0.3 CTF 的定位

`CTF` 更适合作为项目中的一个模块，而不是整个产品名。

推荐模块结构：

```text
SuiSec Dojo
├── CTF Arena              # 做题挑战
├── Incident Replay        # 历史漏洞复盘
├── Move Security Labs     # 交互式安全实验
├── Best Practices         # 安全最佳实践
├── Security Passport      # 链上学习凭证
└── Walrus Archive         # 资料与复盘知识库
```

中文模块结构：

```text
SuiSec 道场
├── CTF 竞技场
├── 事件复盘
├── Move 安全实验
├── 安全最佳实践
├── 安全护照
└── Walrus 知识库
```

---

## 1. 项目概述

SuiSec Dojo 是一个面向 Sui Move 开发者、安全研究员和 Web3 学习者的链上安全训练平台。

项目目标不是做传统的 Web 安全靶场，而是构建一个 **Sui 原生的 Move 合约安全靶场**，结合 Walrus 作为前端与知识资料存储层，帮助用户通过真实交互理解 Sui 上的安全最佳实践、常见漏洞模式和历史安全事件教训。

项目核心定位：

> 一个部署在 Walrus 上、运行在 Sui 上、围绕 Move 合约安全训练和历史漏洞复盘构建的去中心化安全学习平台。

---

## 2. 核心理念

### 2.1 不是传统虚拟机靶场

传统网络安全靶场通常需要虚拟机、Docker、Linux 服务、数据库、Web 服务等运行环境，用来模拟 Web 漏洞、内网渗透、权限提升等场景。

本项目的训练对象主要是：

- Sui Move 合约漏洞
- Sui Object Model 安全
- Shared Object 权限边界
- Capability Pattern 使用风险
- DeFi 合约逻辑错误
- PTB 组合交易风险
- 历史漏洞事件的抽象复盘

因此第一阶段不需要虚拟机，不需要靶机，不需要服务器，也不需要自建 Sui 节点。

最小运行环境为：

```text
Walrus Site 前端
+
Sui testnet/devnet 合约
+
Walrus 存储资料
+
用户钱包 / Sui CLI
```

---

### 2.2 Sui 作为靶场执行层

Sui 负责：

- 部署 vulnerable challenge 合约
- 创建 challenge instance
- 记录用户完成进度
- 执行链上判题逻辑
- 发放 badge / certificate
- 存储 challenge registry
- 存储 Walrus blob/object 的索引信息

---

### 2.3 Walrus 作为前端与知识库层

Walrus 负责：

- 托管静态前端，即 Walrus Site
- 存储题目说明
- 存储漏洞复盘文章
- 存储参考代码包
- 存储审计 checklist
- 存储图片、图解、Markdown 文档
- 后续可存储视频、PDF、用户提交报告等资料

Walrus 不负责执行后端逻辑，不负责数据库，不负责动态 API。

---

### 2.4 第一版尽量 Serverless

第一版不做中心化后端。

不需要：

- Node.js 后端
- 数据库
- Redis
- 自建 RPC 节点
- Docker 沙箱
- Kubernetes
- VM 靶机
- 用户账号系统
- 中心化自动判题系统

第一版尽量使用：

- Walrus Site
- Sui testnet/devnet
- Sui Wallet
- 链上状态判定
- GitHub 代码仓库
- 静态题库数据

---

## 3. 产品目标

### 3.1 MVP 目标

第一版目标是做出一个可公开展示、可实际体验的基础版本。

MVP 需要证明：

1. 用户可以通过 Walrus Site 访问平台。
2. 用户可以连接 Sui 钱包。
3. 用户可以浏览安全挑战题目。
4. 用户可以领取一个链上 challenge instance。
5. 用户可以通过 Sui 交易完成挑战。
6. 合约可以判断用户是否完成挑战。
7. 用户完成进度可以写入链上。
8. 用户可以查看自己的完成记录。
9. 题目说明、复盘文章、代码包可以存储在 Walrus。
10. 项目整体能够体现 Sui + Walrus 原生应用叙事。

---

### 3.2 非目标

MVP 阶段暂不实现：

- 复杂后台管理系统
- AI Tutor
- 付费订阅
- 企业培训后台
- 多人团队空间
- 完整排行榜
- 自动审计报告评分
- 复杂链下判题
- 真实历史协议完整复刻
- 生产级主网资产交互
- 真实漏洞利用脚本分发

---

## 4. 目标用户

### 4.1 主要用户

- Sui Move 初学者
- Move 合约开发者
- Web3 安全学习者
- 想理解 Sui 对象模型的开发者
- 想进入 Move 审计方向的安全研究员

### 4.2 次要用户

- Sui 生态项目方
- 安全团队
- 审计公司
- 教育平台
- Web3 黑客松参与者
- Sui / Walrus 生态建设者

---

## 5. MVP 功能范围

### 5.1 前端功能

前端以静态站形式部署在 Walrus Sites。

页面包括：

1. 首页
2. Challenge 列表页
3. Challenge 详情页
4. 用户进度页
5. Badge / Certificate 展示页
6. 文档 / 复盘文章页
7. 基础说明页

---

### 5.2 钱包连接

支持连接 Sui 钱包。

基础功能：

- 获取当前钱包地址
- 查询用户是否已经领取 challenge
- 查询用户是否完成 challenge
- 发起领取 challenge 交易
- 发起 solve 交易
- 显示交易执行结果

---

### 5.3 Challenge 列表

每道题展示：

- 题目标题
- 难度
- 类型
- 关联知识点
- 是否已完成
- 简短说明
- 对应 Walrus 资料链接
- 对应链上 challenge id / package id

示例字段：

```ts
type ChallengeMetadata = {
  id: string;
  title: string;
  slug: string;
  difficulty: "beginner" | "easy" | "medium" | "hard";
  category: string;
  tags: string[];
  description: string;
  packageId?: string;
  moduleName?: string;
  walrusBlobId?: string;
  sourceUrl?: string;
};
```

---

### 5.4 Challenge 详情页

每道题详情页展示：

- 背景说明
- 漏洞合约简介
- 目标
- 操作提示
- 合约地址 / package id
- 领取挑战按钮
- 提交 / solve 按钮
- 完成状态
- 解题后显示复盘内容
- 参考修复思路
- 安全最佳实践 checklist

---

### 5.5 用户进度页

用户连接钱包后，可以看到：

- 已完成题目数量
- 总题目数量
- 每道题完成状态
- 获得的 badge
- 当前学习路径
- 最近完成记录

MVP 阶段进度从链上读取，不依赖数据库。

---

### 5.6 Badge / Certificate

MVP 可以实现基础版 badge。

完成某类题目后，用户可以获得一个链上 badge object。

示例 badge：

- Object Security Beginner
- Capability Pattern Beginner
- Shared Object Security Beginner
- DeFi Logic Beginner
- Historical Incident Review Beginner

MVP 可以先做不可转让或普通 object 形式，后续再扩展为 SBT / NFT 标准。

---

## 6. 系统架构

### 6.1 总体架构

```text
User Browser
  |
  | accesses
  v
Walrus Site Frontend
  |
  | connects wallet
  v
Sui Wallet
  |
  | signs transactions
  v
Sui Testnet / Devnet Contracts
  |
  | reads metadata references
  v
Walrus Blobs
```

---

### 6.2 模块分工

| 模块 | 作用 |
|---|---|
| Walrus Site | 托管前端静态页面 |
| Walrus Blob | 存储题目、复盘、代码包、文档 |
| Sui Challenge Contracts | 运行漏洞题目和判题逻辑 |
| Sui Progress Contract | 记录用户完成状态 |
| Sui Badge Contract | 发放学习凭证 |
| Frontend | 连接钱包、展示题目、发起交易 |
| GitHub Repo | 存储源码、开发文档、本地测试脚本 |

---

## 7. Sui 合约设计

### 7.1 合约包结构建议

```text
contracts/
  Move.toml
  sources/
    challenge_registry.move
    user_progress.move
    badge.move
    challenge_01_anyone_can_mint.move
    challenge_02_shared_vault.move
    challenge_03_fake_owner.move
    challenge_04_leaky_capability.move
    challenge_05_bad_init.move
    challenge_06_price_rounding.move
    challenge_07_overflow_guard.move
    challenge_08_old_package_trap.move
    challenge_09_ptb_combo.move
    challenge_10_mini_amm_incident.move
  tests/
    challenge_01_tests.move
    challenge_02_tests.move
    ...
```

---

### 7.2 Challenge Registry

`challenge_registry.move` 负责管理题目注册信息。

功能：

- 创建 ChallengeRegistry
- 注册题目
- 记录题目基本信息
- 记录题目对应的 Walrus blob id
- 记录题目启用状态
- 供前端读取题目索引

示例结构：

```move
public struct ChallengeRegistry has key {
    id: UID,
    admin: address,
    challenges: vector<ChallengeInfo>,
}

public struct ChallengeInfo has store, copy, drop {
    challenge_id: u64,
    title: vector<u8>,
    difficulty: u8,
    category: vector<u8>,
    walrus_blob_id: vector<u8>,
    enabled: bool,
}
```

---

### 7.3 User Progress

`user_progress.move` 负责记录用户学习进度。

功能：

- 为用户创建 progress object
- 标记某道题完成
- 查询完成状态
- 记录完成时间 / tx context epoch
- 防止重复领取奖励

示例结构：

```move
public struct UserProgress has key {
    id: UID,
    owner: address,
    completed_challenges: vector<u64>,
    badges: vector<u64>,
}
```

---

### 7.4 Badge

`badge.move` 负责发放基础学习凭证。

功能：

- 完成特定题目后 mint badge
- 防止重复 mint
- 记录 badge 类型
- 可选：设计为不可转让

示例：

```move
public struct Badge has key, store {
    id: UID,
    owner: address,
    badge_type: u64,
    issued_at_epoch: u64,
}
```

---

### 7.5 Challenge Instance

每道题可以有自己的 challenge object。

目标是让用户领取一个独立实例，避免状态互相污染。

示例：

```move
public struct ChallengeInstance has key {
    id: UID,
    challenge_id: u64,
    owner: address,
    solved: bool,
}
```

每道题可以根据题目需要扩展自己的状态结构。

---

## 8. 链上判题设计

### 8.1 基本原则

MVP 阶段尽量使用链上判题。

也就是说，不需要用户提交代码给后端，不需要中心化服务判断答案。

用户通过 Sui 交易构造出特定状态后，调用 `solve` 函数完成题目。

示例：

```move
public entry fun solve(
    instance: &mut ChallengeInstance,
    proof: &SomeProofObject,
    progress: &mut UserProgress,
    ctx: &mut TxContext
) {
    assert!(!instance.solved, EAlreadySolved);
    assert!(is_valid_solution(instance, proof, tx_context::sender(ctx)), EInvalidSolution);

    instance.solved = true;
    user_progress::mark_completed(progress, instance.challenge_id);
}
```

---

### 8.2 适合链上判题的题型

适合：

- 权限绕过
- 错误 mint
- 错误 withdraw
- shared object 状态篡改
- AMM 价格操纵
- LP share 计算错误
- capability 泄露
- 初始化错误
- 对象转移错误
- PTB 组合攻击

不适合完全链上判题：

- 审计报告质量评分
- 自然语言解释题
- 复杂漏洞分析报告
- 开放式修复题

这些可以放到后续版本。

---

## 9. MVP 题库规划

第一版建议做 10 道题。

### 9.1 Challenge 01: Anyone Can Mint

知识点：

- TreasuryCap
- AdminCap
- mint 权限
- public entry 暴露风险

漏洞模式：

- mint 函数没有校验权限
- 任意用户可以铸造测试币

目标：

- 用户通过漏洞铸造指定数量的 ChallengeCoin
- 调用 solve 函数完成验证

判定：

- 用户地址下持有的 ChallengeCoin 数量达到指定阈值

---

### 9.2 Challenge 02: Shared Vault

知识点：

- Shared Object
- Vault 权限控制
- 存取款逻辑

漏洞模式：

- shared vault 的 withdraw 函数没有校验 owner
- 任意用户可以取出 vault 中的资产

目标：

- 用户从 vault 中取出指定测试资产

判定：

- vault 余额减少
- 用户获得目标 coin
- 或 instance 状态满足 solved 条件

---

### 9.3 Challenge 03: Fake Owner

知识点：

- `tx_context::sender`
- owner 字段
- address 校验

漏洞模式：

- 合约错误信任传入的 address 参数
- 用户可以伪造 owner 参数绕过权限

目标：

- 用户通过伪造参数执行受限操作

判定：

- 用户成功修改只有 owner 才能修改的状态

---

### 9.4 Challenge 04: Leaky Capability

知识点：

- Capability Pattern
- AdminCap 转移
- 对象权限泄露

漏洞模式：

- AdminCap 被错误转移给普通用户
- 或 AdminCap 被封装在可公开获取的对象里

目标：

- 用户获取 capability 并调用受限函数

判定：

- 用户执行成功管理员操作

---

### 9.5 Challenge 05: Bad Init

知识点：

- init 函数
- 一次性初始化
- 管理员对象创建

漏洞模式：

- 初始化逻辑错误
- 管理员对象没有正确绑定部署者
- 或存在可重复初始化路径

目标：

- 用户利用初始化错误获得管理员权限

判定：

- 用户成为 challenge admin
- 或成功创建非法 AdminCap

---

### 9.6 Challenge 06: Price Rounding

知识点：

- DeFi 数学
- 精度损失
- 舍入方向
- coin amount 计算

漏洞模式：

- 买入/卖出计算中使用错误舍入方式
- 用户可以通过小额多次交易获得超额资产

目标：

- 用户通过交易组合使余额超过正常预期

判定：

- 用户获得超过阈值的测试资产

---

### 9.7 Challenge 07: Overflow Guard

知识点：

- overflow / underflow
- 边界检查
- DeFi 计算顺序

漏洞模式：

- 合约写了看似存在的 overflow check
- 但检查条件错误，无法真正防止异常计算

目标：

- 用户构造极端输入破坏计算逻辑

判定：

- 池子状态被操纵
- 或用户获得异常收益

---

### 9.8 Challenge 08: Old Package Trap

知识点：

- package upgrade
- deprecated module
- 旧入口函数残留
- 版本迁移安全

漏洞模式：

- 新版本修复了逻辑
- 但旧版本 package 的可调用入口仍然存在
- 用户可以调用旧路径绕过新限制

目标：

- 用户通过旧入口完成本不应该允许的操作

判定：

- 用户通过 deprecated entry 修改状态

---

### 9.9 Challenge 09: PTB Combo

知识点：

- Programmable Transaction Block
- 多步骤组合交易
- 状态假设失效
- 原子性

漏洞模式：

- 合约假设某些状态变化不可能在同一个交易中组合出现
- 用户通过 PTB 在单笔交易中完成组合攻击

目标：

- 用户通过多步骤组合破坏合约预期

判定：

- 用户在单个 PTB 中完成指定状态转移

---

### 9.10 Challenge 10: Mini AMM Incident

知识点：

- AMM
- invariant
- reserve
- LP share
- price manipulation
- historical incident abstraction

漏洞模式：

- 抽象历史 AMM 漏洞
- 不复刻真实协议完整代码
- 只保留核心漏洞模式

目标：

- 用户通过漏洞使 AMM 池状态异常
- 理解漏洞发生原因和修复方式

判定：

- 用户获得异常数量测试资产
- 或 invariant 被破坏后调用 solve 成功

---

## 10. 历史漏洞复盘设计

### 10.1 复盘原则

历史事件复盘要遵守安全边界。

允许：

- 复盘公开事件
- 抽象漏洞模式
- 编写最小化模拟合约
- 讲解安全教训
- 提供修复思路
- 提供审计 checklist

不允许：

- 提供可直接攻击真实协议的完整 exploit
- 复刻真实线上协议的完整业务逻辑
- 针对未修复漏洞制作教程
- 引导用户攻击真实资产

---

### 10.2 每篇复盘结构

每个历史事件复盘建议使用统一结构：

```markdown
# Incident Replay: xxx

## 1. Background

## 2. Vulnerability Pattern

## 3. Simplified Model

## 4. Attack Flow

## 5. State Transition

## 6. Root Cause

## 7. Fix Strategy

## 8. Audit Checklist

## 9. Related Challenge

## 10. Further Reading
```

---

### 10.3 MVP 复盘主题

第一版建议做 3 个抽象复盘：

1. AMM 数学错误复盘
2. Capability / 权限泄露复盘
3. Shared Object 状态污染复盘

---

## 11. Walrus 内容设计

### 11.1 Walrus 存储内容

Walrus 存储以下内容：

```text
challenge statements
source code zip
walkthrough markdown
incident replay markdown
security checklist
images
diagrams
frontend static files
```

---

### 11.2 内容目录建议

```text
content/
  challenges/
    01-anyone-can-mint/
      statement.md
      walkthrough.md
      fix.md
      checklist.md
      source.zip
    02-shared-vault/
      statement.md
      walkthrough.md
      fix.md
      checklist.md
      source.zip
  incidents/
    amm-math-error/
      replay.md
      diagram.png
    capability-leak/
      replay.md
      diagram.png
    shared-object-pollution/
      replay.md
      diagram.png
  docs/
    getting-started.md
    sui-security-basics.md
    walrus-deployment.md
```

---

### 11.3 前端静态站构建

前端建议使用：

- Vite + React
- TypeScript
- Tailwind CSS
- Sui TypeScript SDK
- dApp Kit

也可以使用 Next.js，但必须静态导出。

推荐优先 Vite，因为静态部署到 Walrus Site 更直接。

---

## 12. 前端工程设计

### 12.1 目录结构建议

```text
frontend/
  package.json
  vite.config.ts
  src/
    main.tsx
    App.tsx
    routes/
      Home.tsx
      Challenges.tsx
      ChallengeDetail.tsx
      Profile.tsx
      Badges.tsx
      Docs.tsx
    components/
      WalletConnectButton.tsx
      ChallengeCard.tsx
      ChallengeStatus.tsx
      ProgressSummary.tsx
      BadgeCard.tsx
      MarkdownRenderer.tsx
    lib/
      suiClient.ts
      wallet.ts
      challengeApi.ts
      walrus.ts
      constants.ts
    data/
      challenges.ts
      docs.ts
  public/
```

---

### 12.2 前端页面

#### 首页

展示：

- 项目介绍
- Start Learning 按钮
- 当前题目数量
- 支持的学习路线
- Sui + Walrus 架构说明

---

#### Challenge 列表页

展示：

- 所有题目
- 难度筛选
- 类型筛选
- 完成状态
- 进入详情按钮

---

#### Challenge 详情页

展示：

- 题目说明
- 目标
- 合约信息
- 领取按钮
- solve 按钮
- 完成状态
- 复盘内容入口
- GitHub 源码链接

---

#### Profile 页面

展示：

- 当前钱包地址
- 完成进度
- 已完成题目
- 已获得 badge
- 学习路径

---

### 12.3 前端状态来源

前端数据来自三类来源：

1. 本地静态 metadata
2. Walrus blob 内容
3. Sui 链上对象状态

MVP 可以先用本地静态 metadata 管理题目列表，后续再完全链上索引。

---

## 13. RPC 使用策略

### 13.1 MVP 策略

MVP 阶段使用 Sui 官方公共 RPC 或第三方免费 RPC。

不自建 Sui 节点。

前端需要通过 RPC：

- 查询对象
- 查询交易
- 查询用户拥有的 object
- 查询 challenge registry
- 提交交易
- 查询事件

### 13.2 后续升级

如果出现限流、查询慢、用户变多，可以切换为付费 RPC 服务。

前端代码应将 RPC endpoint 配置为环境变量或常量，方便切换。

示例：

```ts
export const SUI_NETWORK = "testnet";

export const SUI_RPC_URL =
  import.meta.env.VITE_SUI_RPC_URL || "https://fullnode.testnet.sui.io:443";
```

---

## 14. 开发阶段规划

### 14.1 Phase 0: 技术打通

目标：

- 创建前端项目
- 部署一个简单 Walrus Site
- 创建一个最简单 Sui Move challenge
- 前端连接钱包
- 前端调用合约领取 challenge
- 前端读取链上完成状态

交付物：

```text
1 个 Walrus Site
1 个 Sui Move package
1 道测试题
1 个钱包连接页面
1 个完成状态页面
```

---

### 14.2 Phase 1: MVP 骨架

目标：

- 完成 ChallengeRegistry
- 完成 UserProgress
- 完成 Badge 基础模块
- 完成前端题目列表
- 完成题目详情页
- 完成用户进度页
- 接入 Walrus 文档读取

交付物：

```text
基础平台闭环
3 道 challenge
1 个 badge
Walrus 文档存储
```

---

### 14.3 Phase 2: 十题版本

目标：

- 完成 10 道题
- 每道题有 statement
- 每道题有 walkthrough
- 每道题有 fix explanation
- 每道题有测试
- 完成 3 篇历史复盘
- 完成基础 UI 优化

交付物：

```text
10 道 Sui Move 安全题
3 篇历史复盘
完整学习闭环
可公开发布版本
```

---

### 14.4 Phase 3: 增强版本

后续可选：

- 排行榜
- AI Tutor
- 审计报告提交
- 后端索引服务
- 用户报告生成
- 多语言
- 企业训练路线
- 题目发布后台
- 高级 badge / SBT
- 主网证书

---

## 15. 开发优先级

### P0 必须完成

- Walrus Site 前端
- Sui 钱包连接
- Challenge 列表
- Challenge 详情
- 至少 1 道完整 challenge
- 链上领取 challenge
- 链上 solve 判题
- 用户进度记录
- 基础文档

---

### P1 应该完成

- 10 道题
- 3 篇复盘
- Badge
- Profile 页面
- Markdown 文档渲染
- GitHub 源码链接
- Walrus blob 内容索引

---

### P2 后续完成

- 排行榜
- 多语言
- 题目筛选
- AI Hint
- 后端索引
- 审计报告上传
- 管理后台
- 高级证书系统

---

## 16. 安全边界

### 16.1 教育用途声明

平台需要明确声明：

```text
本平台仅用于安全教育、审计训练和防御研究。
所有漏洞案例均为最小化模拟版本。
禁止将平台内容用于攻击真实协议、真实资产或未授权系统。
历史事件复盘不提供可直接攻击线上协议的完整利用脚本。
```

---

### 16.2 合约安全原则

即使是靶场，也要避免影响真实资产。

MVP 阶段原则：

- 只部署到 testnet/devnet
- 使用测试资产
- 不接入真实资金
- 不复用真实协议完整代码
- 不发布真实协议可直接利用脚本
- challenge 合约之间状态隔离
- 每个用户领取独立 instance

---

## 17. 本地开发说明

### 17.1 安装依赖

前端：

```bash
cd frontend
npm install
npm run dev
```

合约：

```bash
cd contracts
sui move build
sui move test
```

---

### 17.2 部署合约

示例：

```bash
sui client publish --gas-budget 100000000
```

发布后记录：

```text
PACKAGE_ID
CHALLENGE_REGISTRY_ID
BADGE_MODULE_ID
USER_PROGRESS_MODULE_ID
```

将这些写入前端配置：

```ts
export const CONTRACTS = {
  PACKAGE_ID: "...",
  CHALLENGE_REGISTRY_ID: "...",
};
```

---

### 17.3 部署 Walrus Site

前端构建：

```bash
cd frontend
npm run build
```

部署到 Walrus Site：

```bash
site-builder --context testnet deploy ./dist --epochs 5
```

后续更新：

```bash
site-builder --context testnet update ./dist <SITE_OBJECT_ID> --epochs 5
```

---

## 18. 推荐技术栈

### 18.1 前端

- Vite
- React
- TypeScript
- Tailwind CSS
- Sui TypeScript SDK
- Sui dApp Kit
- Markdown renderer

---

### 18.2 合约

- Sui Move
- Sui CLI
- Move unit tests

---

### 18.3 存储与部署

- Walrus Sites
- Walrus blobs
- GitHub

---

### 18.4 后续可选

- Supabase / Neon
- Cloudflare Workers
- Railway / Fly.io
- AI API
- Indexer

---

## 19. 代码质量要求

### 19.1 合约代码

要求：

- 每道题单独模块
- 每道题有测试
- 错误码清晰
- 注释说明漏洞点
- 正常路径和攻击路径都要测试
- challenge instance 状态隔离
- 不与真实资产交互

---

### 19.2 前端代码

要求：

- TypeScript
- 组件拆分清晰
- 合约地址集中配置
- RPC endpoint 可配置
- 钱包未连接时有提示
- 交易失败时显示错误
- 交易成功后刷新状态
- 移动端基本可用

---

### 19.3 文档

要求：

- 每道题都有题目说明
- 每道题都有复盘说明
- 每道题都有修复建议
- 每道题都有对应安全 checklist
- 所有文档使用 Markdown
- 文档可以独立上传到 Walrus

---

## 20. MVP 验收标准

MVP 完成时，需要满足：

1. 用户可以通过 Walrus Site 打开网站。
2. 用户可以连接 Sui 钱包。
3. 用户可以看到至少 10 道 challenge。
4. 用户可以进入题目详情页。
5. 用户可以领取 challenge instance。
6. 用户可以通过交易完成至少一类漏洞挑战。
7. 用户完成后，链上状态更新。
8. Profile 页面能显示完成状态。
9. 用户可以获得基础 badge。
10. 题目说明和复盘文章可以从 Walrus 获取。
11. 所有合约通过 `sui move test`。
12. 前端可以静态构建并部署到 Walrus Site。
13. 项目 README 能说明如何本地开发、部署合约、部署前端。

---

## 21. 项目一句话介绍

英文：

```text
SuiSec Dojo is a decentralized security training platform for Sui Move developers, using Sui for interactive challenge execution and Walrus for static frontend and security knowledge storage.
```

中文：

```text
SuiSec Dojo 是一个面向 Sui Move 开发者的去中心化安全训练平台，使用 Sui 执行交互式靶场挑战，使用 Walrus 托管前端与安全知识库。
```

---

## 22. 后续产品方向

MVP 完成后，可以扩展为：

- Sui Move 安全课程
- Sui 历史漏洞复盘库
- Move 审计训练平台
- 链上安全学习凭证系统
- Web3 安全人才认证平台
- Sui 生态安全教育基础设施
- Walrus 原生知识库样板项目

最终形态可以是：

> Sui 安全事故博物馆 + 可交互靶场 + Move 审计训练营 + 链上学习凭证系统。
