# 测试驱动开发与分层测试最佳实践指南

> 适用对象：开发者、AI Coding Agent、CI/CD 维护者  
> 目标：在保证软件质量的同时，避免“每次改动都跑全量测试”导致开发体验恶化。  
> 核心原则：**用最小测试成本，尽早发现最关键的问题。**

---

## 1. 总体原则

测试不是越多越好，而是要做到：

1. **反馈快**：本地开发阶段优先跑快速测试。
2. **覆盖关键路径**：核心业务、资金、权限、数据一致性等高风险逻辑必须重点覆盖。
3. **失败可信**：测试失败应尽量定位明确，避免大量 flaky test 破坏信任。
4. **分层执行**：不同阶段运行不同测试集，本地、PR、main、发布前的测试强度不同。
5. **风险驱动**：低风险改动少跑，高风险改动多跑。
6. **AI Agent 可执行**：测试策略要明确到命令、范围、验收标准，便于 AI Agent 自动遵守。

一句话总结：

> **本地跑快测试，提交前跑相关测试，CI 跑分层测试，合并和发布前跑完整测试。**

---

## 2. 测试类型速览

| 测试类型 | 核心问题 | 粒度 | 速度 | 典型执行阶段 |
|---|---|---:|---:|---|
| Format / Lint / Type Check | 代码是否规范、能否通过静态检查 | 很小 | 很快 | 保存、提交前、CI |
| Unit Test | 单个函数/模块逻辑是否正确 | 小 | 很快 | 本地频繁运行 |
| Integration Test | 多个模块协作是否正确 | 中 | 中等 | 提交前、PR、CI |
| E2E Test | 用户完整流程是否跑通 | 大 | 慢 | PR、main、发布前 |
| Smoke Test | 系统是否基本可用 | 浅 | 快 | 构建后、部署后、发布前 |
| Sanity Test | 某个修复/改动是否大体正确 | 小到中 | 快 | Bug 修复后、局部验证 |
| Regression Test | 旧功能是否被新改动破坏 | 可大可小 | 取决于范围 | PR、main、发布前 |
| Performance Test | 性能是否满足要求 | 系统级 | 慢 | 发布前、定期任务 |
| Security Test | 是否存在安全漏洞 | 多层级 | 中到慢 | PR、发布前、定期任务 |

---

## 3. 测试金字塔

推荐结构：

```text
        少量 E2E Test
      适量 Integration Test
    大量 Unit Test
```

推荐比例可以粗略理解为：

```text
70% Unit Test
20% Integration Test
10% E2E Test
```

这不是硬性比例，而是方向：

- **业务规则、算法、金额计算、权限判断**：优先使用 Unit Test。
- **数据库、缓存、消息队列、外部模块协作**：使用 Integration Test。
- **登录、下单、支付、核心工作流**：使用少量 E2E Test 验证主路径。

避免倒金字塔：

```text
少量 Unit Test
大量 E2E Test
```

倒金字塔会导致测试慢、脆弱、定位困难，最终开发者和 AI Agent 都不愿意运行测试。

---

## 4. TDD 的推荐工作流

经典 TDD 循环：

```text
Red → Green → Refactor
```

含义：

1. **Red**：先写一个失败测试，明确目标行为。
2. **Green**：写最少代码让测试通过。
3. **Refactor**：在测试保护下重构实现。

推荐实践：

```text
1. 明确需求和边界条件
2. 先写最小失败测试
3. 实现最小可用逻辑
4. 跑局部测试
5. 补充边界测试
6. 重构
7. 跑相关测试集
8. 提交前运行基础质量检查
```

### 适合 TDD 的场景

TDD 特别适合：

- 金额计算
- 权限判断
- 解析器
- 状态机
- 数据转换
- 策略匹配
- 业务规则
- Bug 修复
- 复杂边界条件

### 不适合强行 TDD 的场景

以下场景可以先探索，再补测试：

- UI 视觉样式探索
- 技术 spike / 原型验证
- 第三方 SDK 行为未知
- 架构方案尚未稳定
- 需求频繁变化的早期实验代码

原则：

> **稳定逻辑用 TDD，探索性代码先验证方向，再沉淀测试。**

---

## 5. 不同开发阶段应该跑什么测试

### 5.1 本地编码中

目标：快速反馈，不打断思路。

推荐执行：

```bash
cargo check
cargo test 当前模块或当前函数
```

示例：

```bash
cargo test pricing
cargo test auth
cargo test order_state
```

不要每次小改动都跑：

```bash
cargo test --workspace --all-features
```

除非当前改动影响范围很大。

---

### 5.2 提交前

目标：保证提交质量，不把明显问题带入仓库。

Rust 项目推荐：

```bash
cargo fmt --check
cargo clippy -- -D warnings
cargo test
```

如果项目较大，可以改为：

```bash
cargo fmt --check
cargo clippy -- -D warnings
cargo test -p changed_crate
cargo test related_test_name
```

---

### 5.3 PR 阶段

目标：验证改动不会破坏主要功能。

推荐执行：

```bash
cargo fmt --check
cargo clippy -- -D warnings
cargo test --workspace
cargo test --workspace --all-features
```

如果有服务部署或 Web 项目，可加：

```bash
curl -f http://localhost:3000/health
```

或运行少量 E2E smoke tests。

---

### 5.4 合并到 main 后

目标：保护主干稳定。

推荐执行：

```text
1. 全量 unit tests
2. 关键 integration tests
3. 构建 release artifact
4. 部署到 staging
5. staging smoke test
6. 核心 E2E tests
```

---

### 5.5 发布前

目标：降低上线风险。

推荐执行：

```text
1. Full regression tests
2. Database migration tests
3. Security scan
4. Performance smoke test
5. 关键业务路径手工验收
6. Staging 环境 smoke test
```

---

## 6. 风险驱动测试矩阵

不同改动类型应对应不同测试强度。

| 改动类型 | 风险 | 本地测试 | PR 测试 | 发布前测试 |
|---|---:|---|---|---|
| 注释 / 文档 | 低 | 可不跑或仅格式检查 | 可跳过重测试 | 无需额外测试 |
| UI 文案 / 样式 | 低 | 前端局部测试 | smoke test | 关键页面检查 |
| 普通业务逻辑 | 中 | unit + 相关 integration | workspace tests | 相关 regression |
| 数据库查询 / Repository | 中 | repository integration | DB integration | migration / regression |
| 认证 / 权限 | 高 | unit + integration + negative cases | full auth tests + E2E | security + regression |
| 支付 / 资金 / 订单 | 高 | unit + integration | full related tests + E2E | full regression |
| 数据库 migration | 高 | migration up/down test | staging migration test | backup + rollback 演练 |
| 公共基础库 | 高 | 全相关 crate 测试 | workspace full test | full regression |
| 并发 / 异步逻辑 | 高 | unit + race-sensitive tests | stress-like integration | performance / stability |

原则：

> **改动风险越高，测试范围越大；改动越局部，测试越聚焦。**

---

## 7. Fast / Slow 测试分组

不要让慢测试污染日常开发流程。

### Fast Tests

适合本地和每次 PR 跑：

- 单元测试
- 无外部依赖的集成测试
- 纯内存测试
- 小型 smoke test
- 静态检查

目标耗时：

```text
本地：10 秒到 1 分钟内
PR 基础 CI：5 分钟内
```

### Slow Tests

适合合并前、发布前、夜间任务跑：

- 真实数据库大规模测试
- 浏览器 E2E
- 第三方 API 测试
- 性能测试
- 压力测试
- 全量回归测试

Rust 可用 `#[ignore]` 标记慢测试：

```rust
#[test]
#[ignore]
fn expensive_database_test() {
    // slow test
}
```

默认运行：

```bash
cargo test
```

运行慢测试：

```bash
cargo test -- --ignored
```

---

## 8. Smoke Test 的使用规范

Smoke test 的目标不是详细验证业务，而是快速确认系统没有明显崩坏。

适合检查：

```text
1. 服务能否启动
2. /health 是否返回 200
3. 数据库是否能连接
4. 配置是否能加载
5. 核心 API 是否有基本响应
6. 关键页面是否能打开
```

示例：

```bash
cargo build
cargo test health_check_works
curl -f http://localhost:3000/health
```

Smoke test 失败意味着：

```text
当前构建不值得继续做更深入测试，应优先修复基础问题。
```

---

## 9. Regression Test 的使用规范

Regression test 的目标是确认旧功能没有被新改动破坏。

最佳实践：

1. 每修复一个 bug，都要补一个 regression test。
2. Regression test 应长期保留。
3. 高风险模块应有稳定的 regression suite。
4. 不要把所有 regression test 都做成 E2E。

示例：

Bug：满 100 减 20 的优惠券在金额正好等于 100 时没有生效。

应补充测试：

```rust
#[test]
fn coupon_should_apply_when_price_equals_threshold() {
    assert_eq!(calculate_total(100, Coupon::Minus20), 80);
}
```

这个测试以后要一直保留，防止同类问题再次出现。

---

## 10. E2E 测试边界

E2E 测试只覆盖核心用户路径，不覆盖所有业务细节。

适合 E2E 的路径：

```text
1. 用户注册 / 登录
2. 创建核心资源
3. 下单 / 支付 / 退款
4. 权限关键路径
5. 核心管理后台流程
```

不适合 E2E 的内容：

```text
1. 大量金额边界条件
2. 所有字段校验组合
3. 算法细节
4. 每个错误分支
5. 所有 UI 小状态
```

这些更适合 Unit Test 或 Integration Test。

推荐拆分：

```text
Unit Test：覆盖业务规则和边界条件
Integration Test：覆盖数据库/API/模块协作
E2E Test：覆盖一条或少数几条主路径
```

---

## 11. Flaky Test 治理

Flaky test 是偶发失败的测试，会严重破坏开发体验。

常见原因：

```text
1. 依赖真实时间
2. 依赖网络
3. 异步等待不充分
4. 测试共享全局状态
5. 数据库数据未隔离
6. 随机数未固定 seed
7. 测试之间存在执行顺序依赖
8. 第三方服务不稳定
```

治理原则：

1. 不允许 flaky test 长期停留在主流程。
2. 可以短期隔离，但必须记录原因和修复计划。
3. 不要用无限 retry 掩盖问题。
4. 测试应独立、可重复、可并行。

建议：

```text
1. 使用固定时间或 mock clock
2. 使用唯一测试数据
3. 每个测试独立数据库 schema 或事务回滚
4. 避免测试间共享状态
5. 外部服务使用 mock/stub/fake server
```

---

## 12. AI Agent 执行协议

AI Agent 修改代码时，应遵守以下流程。

### 12.1 开始修改前

AI Agent 应先判断：

```text
1. 改动属于什么类型？
2. 风险等级是低、中、高？
3. 影响哪些模块？
4. 是否已有相关测试？
5. 是否需要新增 regression test？
```

### 12.2 修改过程中

AI Agent 应优先：

```text
1. 先读相关测试
2. 如果是 bug 修复，先补失败测试
3. 如果是新功能，先写最小行为测试
4. 小步修改代码
5. 优先运行局部测试
```

### 12.3 修改完成后

AI Agent 应运行与改动匹配的测试。

低风险改动：

```bash
cargo fmt --check
cargo check
```

中风险改动：

```bash
cargo fmt --check
cargo clippy -- -D warnings
cargo test related_test_name
cargo test -p changed_crate
```

高风险改动：

```bash
cargo fmt --check
cargo clippy -- -D warnings
cargo test --workspace
cargo test --workspace --all-features
```

如果涉及服务启动：

```bash
curl -f http://localhost:3000/health
```

### 12.4 AI Agent 输出结果时

AI Agent 应报告：

```text
1. 修改了哪些文件
2. 新增或更新了哪些测试
3. 运行了哪些命令
4. 哪些测试通过
5. 哪些测试未运行，以及原因
6. 是否存在剩余风险
```

示例输出：

```text
已完成：
- 修改 src/pricing.rs
- 新增 tests/pricing_coupon.rs
- 补充满减优惠券边界测试

已运行：
- cargo fmt --check ✅
- cargo clippy -- -D warnings ✅
- cargo test pricing ✅

未运行：
- 全量 E2E：本次仅修改 pricing 纯逻辑，不涉及 UI 或部署路径。

剩余风险：
- 未验证真实订单结算链路，建议 PR CI 跑 order integration tests。
```

---

## 13. 推荐的仓库测试命令约定

建议在项目中定义统一命令，减少开发者和 AI Agent 的判断成本。

例如使用 `Makefile`：

```makefile
.PHONY: check test test-fast test-slow ci smoke

check:
	cargo fmt --check
	cargo clippy -- -D warnings
	cargo check

test-fast:
	cargo test --lib

test:
	cargo test

test-slow:
	cargo test -- --ignored

ci:
	cargo fmt --check
	cargo clippy -- -D warnings
	cargo test --workspace --all-features

smoke:
	cargo build
	curl -f http://localhost:3000/health
```

开发者和 AI Agent 就可以统一使用：

```bash
make check
make test-fast
make ci
make smoke
```

---

## 14. CI/CD 分层建议

### Push 阶段

```text
1. Format check
2. Lint
3. Type check
4. Fast unit tests
```

目标：快速反馈，阻止明显低质量提交。

### PR 阶段

```text
1. Push 阶段全部检查
2. Workspace tests
3. 关键 integration tests
4. 少量 smoke E2E
```

目标：保证合并安全。

### Main 分支阶段

```text
1. Full unit tests
2. Full integration tests
3. Build release artifact
4. Deploy staging
5. Staging smoke tests
6. Core E2E tests
```

目标：保护主干稳定。

### Nightly 阶段

```text
1. Full regression tests
2. Slow tests
3. Browser E2E full suite
4. Performance baseline
5. Security scan
```

目标：发现慢问题、系统性问题和非阻塞风险。

### Release 阶段

```text
1. Full regression
2. Migration test
3. Rollback test
4. Security scan
5. Performance smoke test
6. Manual acceptance check for critical paths
```

目标：降低上线风险。

---

## 15. 测试预算

建议为不同阶段设置测试耗时预算。

| 阶段 | 推荐预算 |
|---|---:|
| 本地保存/即时反馈 | < 10 秒 |
| 本地提交前 | < 1 分钟 |
| PR 基础 CI | < 5 分钟 |
| 完整 CI | < 15–30 分钟 |
| Nightly 全量测试 | 可更长 |

如果超过预算，应考虑：

```text
1. 拆分 fast / slow tests
2. 并行化测试
3. 缓存依赖和构建产物
4. 优化最慢测试
5. 减少不必要的 Docker 启停
6. 使用 testcontainers 或共享测试服务
7. 将部分 E2E 下沉为 integration/unit tests
```

---

## 16. 新功能开发示例

需求：新增“满 100 减 20”优惠券。

### 推荐测试策略

Unit Test：

```text
1. 99 元不减
2. 100 元减 20
3. 101 元减 20
4. 多张优惠券冲突规则
5. 优惠后金额不能为负数
```

Integration Test：

```text
1. 下单时优惠券被正确应用
2. 订单金额写入数据库正确
3. 优惠券使用状态被更新
```

E2E Test：

```text
1. 用户选择一张优惠券并成功下单
```

Smoke Test：

```text
1. 订单服务能启动
2. 下单接口能返回基本响应
```

不要做：

```text
用 E2E 覆盖所有优惠券金额边界。
```

---

## 17. Bug 修复示例

Bug：重复邮箱注册时没有返回错误。

### 推荐流程

1. 先写失败测试：

```text
先注册 test@example.com
再次注册 test@example.com
期望返回 EmailAlreadyExists
```

2. 修复代码。
3. 跑局部测试。
4. 补充 regression test。
5. 提交前跑基础检查。

示例命令：

```bash
cargo test duplicate_email
cargo test auth
cargo fmt --check
cargo clippy -- -D warnings
```

---

## 18. 数据库 Migration 测试

数据库 migration 属于高风险改动。

建议测试：

```text
1. migration up 能成功
2. migration down 能成功，如果项目支持 down
3. 旧数据能正确迁移
4. 非空字段是否有默认值
5. 索引是否正确创建
6. 回滚策略是否明确
```

发布前必须验证：

```text
1. staging migration
2. backup 可用
3. rollback 方案
4. 新旧版本兼容性
```

---

## 19. 安全相关改动测试

认证、授权、权限、token、密钥、资金相关逻辑都属于高风险。

必须包含 negative tests：

```text
1. 未登录用户不能访问受保护接口
2. 普通用户不能访问管理员接口
3. 用户 A 不能访问用户 B 的资源
4. 过期 token 被拒绝
5. 伪造 token 被拒绝
6. 权限变更后旧权限不再生效
```

示例：

```text
普通用户调用 DELETE /admin/users/123
期望返回 403 Forbidden
```

安全测试不应只验证“合法用户可以成功”，还必须验证“非法用户不能成功”。

---

## 20. 代码重构时的测试策略

重构目标是不改变外部行为。

推荐流程：

```text
1. 重构前先确认现有测试通过
2. 如果覆盖不足，先补 characterization tests
3. 小步重构
4. 每一步跑局部测试
5. 完成后跑相关 integration tests
```

Characterization test 的作用是记录当前行为：

```text
即使当前实现不好，也先用测试固定外部可观察行为，再安全重构。
```

---

## 21. 测试命名规范

推荐命名格式：

```text
should_<expected_behavior>_when_<condition>
```

示例：

```rust
#[test]
fn should_apply_discount_when_price_reaches_threshold() {
    // ...
}

#[test]
fn should_reject_duplicate_email_when_user_already_exists() {
    // ...
}
```

好的测试名应该回答：

```text
1. 在什么条件下？
2. 应该发生什么？
```

---

## 22. 测试数据规范

测试数据应做到：

1. 独立：测试之间不要共享状态。
2. 明确：数据含义清楚，不使用神秘常量。
3. 最小：只构造测试需要的数据。
4. 可重复：不依赖真实时间和随机网络。
5. 可维护：使用 factory/builder 减少重复。

示例：

```rust
let user = UserBuilder::new()
    .email("test@example.com")
    .role(Role::User)
    .build();
```

避免：

```text
1. 测试依赖固定数据库记录
2. 测试之间依赖执行顺序
3. 测试使用生产环境第三方服务
4. 测试数据过大且难以理解
```

---

## 23. Mock / Stub / Fake 的使用原则

### 适合 mock 的场景

```text
1. 第三方 API
2. 邮件服务
3. 支付网关沙盒外的真实扣款
4. 时间服务
5. 随机数生成器
6. 非核心外部依赖
```

### 不应过度 mock 的场景

```text
1. 核心业务逻辑
2. 数据库查询正确性
3. 事务行为
4. 序列化/反序列化协议
5. 权限判断本身
```

原则：

> **mock 外部不可控依赖，不 mock 自己真正想验证的逻辑。**

---

## 24. Pull Request 测试说明模板

建议每个 PR 包含测试说明。

模板：

```markdown
## 测试说明

### 改动风险
- [ ] 低风险：文档、注释、样式、日志
- [ ] 中风险：普通业务逻辑、局部模块
- [ ] 高风险：权限、支付、订单、数据库、公共基础库

### 已新增/更新测试
- 

### 已运行命令
- [ ] cargo fmt --check
- [ ] cargo clippy -- -D warnings
- [ ] cargo test
- [ ] cargo test --workspace --all-features
- [ ] smoke test
- [ ] E2E test

### 未运行的测试及原因
- 

### 剩余风险
- 
```

---

## 25. AI Agent Prompt 模板

可以把以下内容放进项目的 `AGENTS.md` 或开发规范中。

```markdown
# Testing Instructions for AI Agent

When modifying code, follow these rules:

1. Identify the risk level of the change: low, medium, or high.
2. Read existing tests before changing implementation.
3. For bug fixes, add a failing regression test first when practical.
4. For new business logic, add unit tests for main and boundary cases.
5. Prefer scoped tests during development.
6. Do not run full test suites unless the change is high-risk or broad.
7. After changes, run the smallest sufficient test set.
8. Report exactly which tests were run and which were not run.
9. If tests fail, fix the root cause instead of weakening tests.
10. Do not delete or loosen tests without explaining why.

Recommended commands:

- Low-risk change:
  - cargo fmt --check
  - cargo check

- Medium-risk change:
  - cargo fmt --check
  - cargo clippy -- -D warnings
  - cargo test related_test_name
  - cargo test -p changed_crate

- High-risk change:
  - cargo fmt --check
  - cargo clippy -- -D warnings
  - cargo test --workspace
  - cargo test --workspace --all-features

Always include a final testing summary:

- Files changed
- Tests added or updated
- Commands run
- Results
- Tests not run
- Remaining risks
```

---

## 26. 最终检查清单

开发者或 AI Agent 提交代码前，至少检查：

```text
1. 是否理解了改动风险？
2. 是否有测试覆盖新行为？
3. 如果是 bug，是否补了 regression test？
4. 是否只在合理层级使用 E2E？
5. 是否运行了与改动范围匹配的测试？
6. 是否避免了 flaky test？
7. 是否记录了未运行测试的原因？
8. 是否有剩余风险需要在 PR 中说明？
```

---

## 27. 核心结论

测试驱动开发的重点不是机械地“先写测试”或“跑全部测试”，而是建立一套可持续的质量反馈系统。

最重要的实践是：

```text
1. 用 TDD 固化关键业务行为。
2. 用测试金字塔控制成本。
3. 用 fast/slow 分组保护开发体验。
4. 用风险矩阵决定测试范围。
5. 用 smoke test 快速判断构建是否可用。
6. 用 regression test 防止旧 bug 复发。
7. 用 CI/CD 分层执行不同强度的测试。
8. 让 AI Agent 明确知道该写什么测试、该跑什么命令、该报告什么结果。
```

最终目标：

> **让测试成为开发速度的加速器，而不是开发流程的阻碍。**
