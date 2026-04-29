# SuiSec Dojo

SuiSec Dojo 是一个面向 Sui Move 开发者的去中心化安全训练平台，使用 Sui 执行交互式靶场挑战，使用 Walrus 托管前端与安全知识库。

## 当前阶段

当前仓库处于 Phase 4 增强版阶段：

- `frontend/`：Vite + React + TypeScript 静态前端骨架。
- `contracts/`：Sui Move challenge 合约与测试，Challenge 01-20 已可在 testnet 领取和 solve。
- `contracts-mainnet/`：主网最小 Dojo Pass / Badge 包准备区，不包含任何 vulnerable challenge。
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
VITE_DONATION_ADDRESS=<PUBLIC_DONATION_ADDRESS_FOR_SUI_AND_WAL>
VITE_CONTACT_EMAIL=<PUBLIC_CONTACT_EMAIL>
VITE_CONTACT_X=<PUBLIC_X_OR_TWITTER_URL>
VITE_CONTACT_TELEGRAM=<PUBLIC_TELEGRAM_URL>
```

捐赠地址为空时，About 页面会显示 disabled 状态，不会诱导用户向未确认地址转账。

合约：

```bash
cd contracts
sui move test
```

当前 testnet package：

```text
0xee8f947a01cef8784f23b981297ee35fb79ff74036c307059185e06b851b803e
```

当前 Challenge Registry：

```text
0xf329c8d04a377719cea5b7bf3a1514a8c2f75267a23c38fa28d2c83cbf92b37b
```

当前 Dojo Pass 主网配置：

```text
Package: 0x02832a4c5d1056428e12fba6eaf480b0103a2000dd1f877f10debbf21e659a02
DojoPassConfig: 0x444a75a4bd554e60b874bebeec4468e4479094c981f3cf74f366316834b4b8b4
Answer unlock price: 0.1 SUI
Badge mint price: 1 SUI
Recipient: 0x7b367a7a1eabcaffda0f3b501fece7ca9d07769ae74185d55452dc15ee556bb8
Walrus Site ID: 0x821cb4fa65d1e15a76f1d8481ff5298abfd8cad042150dcea114a148ca289d40
```

开发地址：

```text
0xda68b5b7583cf1515ad207e1ce1b5d5a630a9c5832023cf2381936743b3dd0a7
```

## 当前链上流程

1. 连接 Sui testnet 钱包。
2. 点击 `Create Progress` 创建 `UserProgress`。
3. 点击 `Claim Instance` 领取 Challenge 01-20 instance。
4. 默认使用 `Challenge Mode`：阅读对象状态、函数签名和 CLI/PTB 模板，自行构造关键调用。
5. 如需降低门槛，可切到 `Guided Mode` 使用辅助按钮，但排行榜记录较低分数。
6. 点击 `Submit Solve` 时会记录 mode、assistance level 和 score。

## Dojo Pass 与徽章

Dojo Pass 是每个地址可领取一次的灵魂绑定凭证：

- 领取 Dojo Pass 不设置价格，只需要用户承担 gas。
- `DojoPass` 只有 `key` 能力，没有 `store` 能力；合约也不提供转让入口。
- 答案解锁状态写入 Dojo Pass 的 `unlocked_challenges`。
- 徽章不再由 challenge solve 自动发放；用户满足条件后，通过 Dojo Pass 的铸造流程获得独立 `Badge` object。
- 徽章铸造资格由本地证明服务读取 testnet `UserProgress` 后签名，合约验签后才允许铸造。

本地证明服务用于开发和测试：

```bash
python3 scripts/badge-proof-service.py
```

服务读取项目外的开发签名密钥：

```text
/Users/anitya/Development/.secrets/suisec-dojo/dojo-pass-proof-ed25519.json
```

Dojo Pass / 答案解锁 / 徽章铸造模块已部署到 mainnet。Vulnerable challenge 仍只运行在 testnet；徽章资格证明由受控服务按 testnet 进度签发。

## 主网上线前准备

主网上线分成两部分：

- Challenge 仍使用 Sui testnet package，不把 vulnerable challenge 发布到 mainnet。
- Dojo Pass、答案解锁、徽章铸造和 Walrus Site 使用 mainnet。

建议新建一个主网运营地址，不复用 testnet 开发地址。该地址用于发布 `contracts-mainnet/`、创建 `DojoPassConfig`、接收收入、持有 Walrus Site object，并在 SuiNS 中设置 Walrus Site ID。私钥和助记词只保存在项目外，例如：

```text
/Users/anitya/Development/.secrets/suisec-dojo-mainnet/
```

主网资金建议：

```text
SUI: 至少 10 SUI，用于 publish、config、Walrus/SuiNS 交易和失败重试。
WAL: 建议 5-20 WAL，用于 Walrus Site 初始存储和更新缓冲。
```

实际 Walrus 成本以上线当天 `walrus info` 和 site-builder 结果为准。Walrus 主网存储同时消耗 WAL 和 SUI，成本随 blob size、epoch 和网络价格变化。

主网合约 dry-run：

```bash
sui client switch --env mainnet
sui client active-address
sui client balance
scripts/publish-dojo-pass-mainnet.sh
```

正式 publish 必须显式确认：

```bash
CONFIRM_MAINNET=1 scripts/publish-dojo-pass-mainnet.sh
```

如果主网运营地址保存在外部签名器或钱包管理器中，不要为了发布导出私钥。
可以先生成 compiled package JSON，再交给受控签名流程预览和发布：

```bash
scripts/build-dojo-pass-mainnet-package.sh
```

创建主网 Dojo Pass config：

```bash
export DOJO_PASS_PACKAGE_ID=<MAINNET_DOJO_PASS_PACKAGE_ID>
export DOJO_PASS_RECIPIENT=<MAINNET_REVENUE_ADDRESS>
export DOJO_PASS_PROOF_PUBLIC_KEY_HEX=<ED25519_PUBLIC_KEY_HEX>
export ANSWER_PRICE_MIST=100000000
export BADGE_PRICE_MIST=1000000000
CONFIRM_MAINNET=1 scripts/create-dojo-pass-config-mainnet.sh
```

主网前端配置：

```bash
VITE_SUI_NETWORK=testnet
VITE_PACKAGE_ID=<TESTNET_CHALLENGE_PACKAGE_ID>
VITE_DOJO_PASS_NETWORK=mainnet
VITE_DOJO_PASS_PACKAGE_ID=<MAINNET_DOJO_PASS_PACKAGE_ID>
VITE_DOJO_PASS_CONFIG_ID=<MAINNET_DOJO_PASS_CONFIG_ID>
VITE_ANSWER_UNLOCK_PRICE_MIST=100000000
VITE_BADGE_MINT_PRICE_MIST=1000000000
```

部署 Walrus mainnet site：

```bash
scripts/build-frontend.sh
CONFIRM_MAINNET=1 scripts/deploy-walrus-mainnet-site.sh
```

部署后把 `deployments/walrus-mainnet.json` 中的 `siteObjectId` 设置到 SuiNS 的 Walrus Site ID。回滚时重新部署上一版 `frontend/dist`，或把 SuiNS 指回上一版 Walrus Site object。

Seal 答案内容准备：

```bash
scripts/prepare-encrypted-answers.sh
```

明文答案只放在 `content-private/answers/`，该目录不提交。没有 Seal key server 和加密答案 artifact 前，只能完成链上解锁状态记录，不能称为完整答案解密上线。

上线 QA 使用：

```text
MAINNET_READINESS_QA.md
```

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
  0xee8f947a01cef8784f23b981297ee35fb79ff74036c307059185e06b851b803e \
  0xf329c8d04a377719cea5b7bf3a1514a8c2f75267a23c38fa28d2c83cbf92b37b
```

Walrus 更新：

```bash
scripts/build-frontend.sh
scripts/update-walrus-site.sh 0x0187c85b9d044089b616316855887d4e29b29268f94f451e1240d3b753842b32
```

## Phase 4 增强版状态

当前 testnet package 已包含：

- Challenge 01-20。
- Challenge 11-15 的完整 walkthrough / fix / checklist / source 文档。
- Challenge 16-20 的 Move module、测试、前端 adapter、CLI/PTB 模板和链上 solve 闭环。
- Challenge Registry，已注册 Challenge 01-20。
- Soulbound Dojo Pass，用于记录答案解锁状态和已铸造徽章类型。
- 通过 Dojo Pass 铸造普通 Badge object，并在 Profile / Passport 展示。
- 三篇事件复盘文档。
- 九篇事件/模式复盘入口：现有 3 篇加 TreasuryCap、upgrade、PTB、oracle、shared authorization、coin accounting 六个扩展主题。
- Completion event，用于无后端排行榜。
- 静态 Tutor Mode。
- 本地审计报告训练。
- `en` / `zh` locale switch 和中文核心内容 fallback。
- testnet-only Security Passport / certificate preview。
- 独立 `dojo_pass` 模块：测试阶段部署在 testnet，用于验证答案解锁和徽章铸造；正式上线后再部署主网版本。漏洞挑战本身仍只在 testnet 运行。
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
