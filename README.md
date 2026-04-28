# SuiSec Dojo

SuiSec Dojo 是一个面向 Sui Move 开发者的去中心化安全训练平台，使用 Sui 执行交互式靶场挑战，使用 Walrus 托管前端与安全知识库。

## 当前阶段

当前仓库处于 Phase 1 MVP 骨架推进阶段：

- `frontend/`：Vite + React + TypeScript 静态前端骨架。
- `contracts/`：Sui Move challenge 合约与测试，Challenge 01-10 已可在 testnet 领取和 solve。
- `contracts/sources/challenge_registry.move`：Phase 1 题库注册表骨架，已发布到 testnet。
- `content/`：可上传到 Walrus 的 Markdown 内容。
- `deployments/testnet.json`：公开 testnet 部署记录。
- `TESTING.md`：测试驱动开发和分层测试协议。
- `SuiSec-Dojo-Development-Spec.md`：产品与技术规格。

## 本地开发

前端：

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

合约：

```bash
cd contracts
sui move test
```

当前 testnet package：

```text
0x9b2478a6cac5d960d11a3f38a829f6312d784712314bd3107b5fc20794111eee
```

当前 Challenge Registry：

```text
0x515d1e3d0fd76c7d0499f45e2d382fac7148423e529bc8d388d902cf03bd6e2b
```

开发地址：

```text
0xda68b5b7583cf1515ad207e1ce1b5d5a630a9c5832023cf2381936743b3dd0a7
```

## 当前链上流程

1. 连接 Sui testnet 钱包。
2. 点击 `Create Progress` 创建 `UserProgress`。
3. 点击 `Claim Instance` 领取 Challenge 01-10 instance。
4. 按题目执行 vulnerable action，然后点击 `Solve Challenge`。
5. 前端刷新链上对象状态，显示完成进度。

## Walrus 准备

Walrus Site 暂不阻塞 Sui 链上闭环。当前仓库已准备本地内容结构和脚本：

```bash
scripts/build-frontend.sh
scripts/deploy-walrus-site.sh
scripts/update-walrus-site.sh
```

本机当前可用 Walrus CLI：

```text
walrus 1.47.0-15e070d60189
site-builder 2.9.0-42bad504afef
```

测试 WAL 不足时，优先通过 Walrus CLI 的 testnet 获取流程自行处理，不使用主网资产。Walrus testnet site 不能直接通过 `wal.app` 打开，需要本地 portal 或第三方 testnet portal。

首次部署流程：

```bash
make check-env
make build
scripts/deploy-walrus-site.sh
```

更新已有站点：

```bash
scripts/update-walrus-site.sh <SITE_OBJECT_ID>
```

公开部署结果写入：

```text
deployments/walrus-testnet.json
```

CLI smoke 示例：

```bash
sui client ptb --move-call <PACKAGE_ID>::user_progress::create
sui client ptb --move-call <PACKAGE_ID>::challenge_01_anyone_can_mint::claim @<PROGRESS_ID>
sui client ptb \
  --move-call <PACKAGE_ID>::challenge_01_anyone_can_mint::vulnerable_mint @<INSTANCE_ID> 1000 \
  --move-call <PACKAGE_ID>::challenge_01_anyone_can_mint::solve @<INSTANCE_ID> @<PROGRESS_ID>
```

## Phase 1 开发中

已加入 `ChallengeRegistry` 合约骨架，用于后续从单题 demo 过渡到题库平台：

- `init_registry`
- `register_challenge`
- `set_enabled`
- `challenge_count`
- `is_enabled`

当前 testnet package 已包含 registry 模块，registry object 已注册 Challenge 01-10 的 metadata。

统一命令：

```bash
make test
make check
make ci
make audit
```

## TDD 约定

开发时遵守 `TESTING.md`：

1. 新业务逻辑先补最小行为测试。
2. Bug 修复先补 regression test。
3. 本地优先运行局部 fast tests。
4. 提交前运行与风险匹配的检查。
5. 输出结果时说明已运行和未运行的测试。

## GitHub

当前远端仓库：

```text
git@github.com:Anthem9/SuiSecDojo.git
```
