# SuiSec Dojo

SuiSec Dojo 是一个面向 Sui Move 开发者的去中心化安全训练平台，使用 Sui 执行交互式靶场挑战，使用 Walrus 托管前端与安全知识库。

## 当前阶段

当前仓库处于 Phase 4 增强版阶段：

- `frontend/`：Vite + React + TypeScript 静态前端骨架。
- `contracts/`：Sui Move challenge 合约与测试，Challenge 01-15 已可在 testnet 领取和 solve。
- 前端已拆成路由式产品结构：Home、Challenges、Incidents、Docs、Leaderboard、Profile、Passport、About。
- `contracts/sources/challenge_registry.move`：Phase 1 题库注册表骨架，已发布到 testnet。
- `content/`：可上传到 Walrus 的 challenge 文档、事件复盘、Tutor hints 和报告模板。
- `deployments/testnet.json`：公开 testnet 部署记录。
- `PUBLIC_MVP_QA.md`：公开 MVP 发布前验收清单。
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

可选公开配置：

```bash
VITE_PUBLIC_SITE_URL=<YOUR_WALRUS_OR_SUINS_URL>
VITE_DONATION_SUI_ADDRESS=<PUBLIC_DONATION_ADDRESS>
VITE_DONATION_WAL_ADDRESS=<PUBLIC_DONATION_ADDRESS>
```

捐赠地址为空时，About 页面会显示 disabled 状态，不会诱导用户向未确认地址转账。

合约：

```bash
cd contracts
sui move test
```

当前 testnet package：

```text
0x8a8e5840bc59e24265857097301ea59a245af0b762470e0b306e032cbb6cc044
```

当前 Challenge Registry：

```text
0xf50321b9ad6ead5a79b4a93412c3886da3bc9e874ff7f1615a38c8c1e3a68eb2
```

开发地址：

```text
0xda68b5b7583cf1515ad207e1ce1b5d5a630a9c5832023cf2381936743b3dd0a7
```

## 当前链上流程

1. 连接 Sui testnet 钱包。
2. 点击 `Create Progress` 创建 `UserProgress`。
3. 点击 `Claim Instance` 领取 Challenge 01-15 instance。
4. 默认使用 `Challenge Mode`：阅读对象状态、函数签名和 CLI/PTB 模板，自行构造关键调用。
5. 如需降低门槛，可切到 `Guided Mode` 使用辅助按钮，但排行榜记录较低分数。
6. 点击 `Submit Solve` 时会记录 mode、assistance level 和 score。

## Challenge Mode 与评分

`solve` 入口现在统一在原 object 参数后追加两个评分参数：

```text
mode: 1 = Challenge Mode, 2 = Guided Mode
assistance_level: 0 = no hint, 1 = concept, 2 = direction, 3 = checklist, 4 = answer viewed
```

计分规则：

- beginner/easy/medium/hard 基础分分别为 `100/150/250/400`。
- Guided Mode 只获得基础分的 `40%`。
- hint 扣分为 `0%/10%/25%/50%/100%`。
- 查看 answer 后仍可完成链上题目，但该次 completion 记 `0` 分。

无后端版本无法防止用户自报 hint 使用情况；该分数用于学习激励和进度展示，不作为严肃竞赛防作弊系统。

## 安全和教育边界

本平台仅用于安全教育、审计训练和防御研究。所有漏洞案例均为最小化模拟版本，禁止用于攻击真实协议、真实资产或未授权系统。

- 只在 Sui testnet/devnet 部署 vulnerable challenge。
- 不接主网真实资产。
- 复盘文章只讲抽象模式、根因、修复策略和审计 checklist。
- 不提供针对真实线上协议的完整 exploit。
- AI Tutor 当前是静态 Tutor Mode，不调用真实 AI API。
- 审计报告训练只在浏览器本地编辑、预览、复制、下载，不上传。

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

当前 Walrus Site object：

```text
0x0187c85b9d044089b616316855887d4e29b29268f94f451e1240d3b753842b32
```

当前 Walrus testnet local portal URL：

```text
http://1dfmlb4xz3wfc6ajfzyf7ydahsjoiyqu27v2yah42o6hczm7m.localhost:3000
```

注意：这个 URL 只有在本机运行 Walrus Sites portal 时才可访问。`*.localhost:3000` 不是公共网关；Walrus 官方 `wal.app` 只支持 mainnet sites。testnet site 的内容可先用 sitemap 验证：

```bash
site-builder --context testnet sitemap 0x0187c85b9d044089b616316855887d4e29b29268f94f451e1240d3b753842b32
```

如果本机无法解析或无法打开 testnet portal，请启动本地 portal。官方推荐的两种方式是：

```bash
# Docker 方式，适合只想浏览 testnet site
git clone https://github.com/MystenLabs/walrus-sites.git
cd walrus-sites
git checkout mainnet
cp portal/server/portal-config.testnet.example.yaml portal/server/portal-config.yaml
PORTAL_TAG="$(site-builder -V | awk '{ print $2 }' | awk -F - '{ printf("v%s\n", $1) }')"
docker run \
  -it \
  --rm \
  -v "$(pwd)/portal/server/portal-config.yaml:/portal-config.yaml:ro" \
  -e PORTAL_CONFIG=/portal-config.yaml \
  -p 3000:3000 \
  "mysten/walrus-sites-server-portal:mainnet-${PORTAL_TAG}"
```

或从 Walrus Sites 源码启动 portal：

```bash
git clone https://github.com/MystenLabs/walrus-sites.git
cd walrus-sites/portal
bun install
cp server/portal-config.testnet.example.yaml server/portal-config.yaml
bun run server
```

然后再访问上面的 `1dfmlb...localhost:3000` 地址。若 Docker 镜像或源码命令随官方版本变化，以 Walrus portal 文档为准：https://docs.wal.app/docs/sites/portals/deploy-locally.html

CLI smoke 示例：

```bash
sui client ptb --move-call <PACKAGE_ID>::user_progress::create
sui client ptb --move-call <PACKAGE_ID>::challenge_01_anyone_can_mint::claim @<PROGRESS_ID>
sui client ptb \
  --move-call <PACKAGE_ID>::challenge_01_anyone_can_mint::vulnerable_mint @<INSTANCE_ID> 1000 \
  --move-call <PACKAGE_ID>::challenge_01_anyone_can_mint::solve @<INSTANCE_ID> @<PROGRESS_ID> 1 0
```

## 公开 MVP 复现流程

从零复现当前公开 MVP：

```bash
git clone git@github.com:Anthem9/SuiSecDojo.git
cd SuiSecDojo
make check-env
cd frontend
npm ci
cp .env.example .env.local
npm run dev
```

质量检查：

```bash
make ci
make audit
scripts/smoke-chain.sh \
  0x8a8e5840bc59e24265857097301ea59a245af0b762470e0b306e032cbb6cc044 \
  0xf50321b9ad6ead5a79b4a93412c3886da3bc9e874ff7f1615a38c8c1e3a68eb2
```

Walrus 更新：

```bash
scripts/build-frontend.sh
scripts/update-walrus-site.sh 0x0187c85b9d044089b616316855887d4e29b29268f94f451e1240d3b753842b32
```

## Phase 4 增强版状态

当前 testnet package 已包含：

- Challenge 01-15。
- Challenge 16-20 的公开路线图卡片；这些题不会显示 claim/solve，直到对应 Move module、测试、前端 adapter 和部署记录完成。
- Challenge Registry，已注册 Challenge 01-15。
- Progress-level badge 记录。
- 普通 Badge object mint 和 Profile 展示。
- 三篇事件复盘文档。
- 九篇事件/模式复盘入口：现有 3 篇加 TreasuryCap、upgrade、PTB、oracle、shared authorization、coin accounting 六个扩展主题。
- Completion event，用于无后端排行榜。
- 静态 Tutor Mode。
- 本地审计报告训练。
- `en` / `zh` locale switch 和中文核心内容 fallback。
- testnet-only Security Passport / certificate preview。
- GitHub Actions CI 质量门禁。

排行榜从 Phase 4 package 的 `challenge_events::ChallengeCompleted` 事件开始统计，旧 package 的历史完成记录不会回填。Profile 仍以当前钱包 owned objects 为准。

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
