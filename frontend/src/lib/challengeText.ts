import type { Locale } from "./i18n";
import type { ChallengeDifficulty, ChallengeMetadata } from "../types";

type ChallengeZhText = {
  title: string;
  category: string;
  description: string;
  tags?: string[];
};

const challengeZh: Record<string, ChallengeZhText> = {
  "1": {
    title: "人人都能增发",
    category: "对象权限",
    description: "利用未受限制的 mint 入口铸出足够的挑战代币，再完成判题。",
    tags: ["TreasuryCap", "AdminCap", "公开入口"],
  },
  "2": {
    title: "共享金库",
    category: "共享对象",
    description: "调用没有校验金库 owner 的提款函数，清空自己的挑战金库。",
    tags: ["共享对象", "提款", "授权"],
  },
  "3": {
    title: "伪造 Owner",
    category: "授权校验",
    description: "把 owner 地址当作参数传入，绕过原本应该检查交易发送者的权限逻辑。",
    tags: ["tx_context::sender", "owner", "地址"],
  },
  "4": {
    title: "泄露的 Capability",
    category: "Capability 模式",
    description: "领取被错误暴露的 AdminCap，并用它修改受保护状态。",
    tags: ["AdminCap", "Capability", "授权"],
  },
  "5": {
    title: "错误初始化",
    category: "初始化安全",
    description: "滥用公开初始化路径创建管理员能力，再初始化受保护状态。",
    tags: ["init", "AdminCap", "Capability"],
  },
  "6": {
    title: "价格舍入",
    category: "DeFi 数学",
    description: "通过多次小额购买利用向上取整，累积超过应得数量的积分。",
    tags: ["舍入", "精度", "DeFi"],
  },
  "7": {
    title: "错误的溢出保护",
    category: "算术边界",
    description: "绕过只检查旧值、却没有检查新输入的保护逻辑。",
    tags: ["边界检查", "状态", "算术"],
  },
  "8": {
    title: "旧 Package 陷阱",
    category: "升级安全",
    description: "使用修复后仍残留的旧入口，继续修改受保护状态。",
    tags: ["升级", "旧入口", "兼容路径"],
  },
  "9": {
    title: "PTB 组合调用",
    category: "可编程交易",
    description: "在同一笔 PTB 中组合调用，打破合约对调用顺序的错误假设。",
    tags: ["PTB", "hot potato", "原子性"],
  },
  "10": {
    title: "迷你 AMM 事故",
    category: "DeFi 数学",
    description: "利用错误的储备更新顺序破坏简化 AMM invariant，并从异常利润中完成判题。",
    tags: ["AMM", "invariant", "储备"],
  },
  "11": {
    title: "对象转移陷阱",
    category: "对象所有权",
    description: "分析 helper 把受保护 custody 分配给错误地址后产生的对象归属问题。",
    tags: ["转移", "owner", "对象托管"],
  },
  "12": {
    title: "共享对象污染",
    category: "共享对象",
    description: "污染没有绑定到指定用户或来源对象的共享状态。",
    tags: ["共享对象", "状态污染", "授权"],
  },
  "13": {
    title: "委托 Capability 滥用",
    category: "Capability 模式",
    description: "利用没有绑定到目标资源的过宽委托能力，执行越权操作。",
    tags: ["委托", "Capability", "作用域"],
  },
  "14": {
    title: "过期 Oracle",
    category: "DeFi 数学",
    description: "使用 freshness 检查绑定错误 epoch 的过期价格。",
    tags: ["Oracle", "epoch", "过期价格"],
  },
  "15": {
    title: "账实不一致",
    category: "DeFi 会计",
    description: "制造没有真实入金支撑的内部积分，并利用账实不一致完成判题。",
    tags: ["Coin", "余额", "会计"],
  },
  "16": {
    title: "签名者混淆",
    category: "授权校验",
    description: "区分交易发送者、对象 owner 和调用者传入的 authority。",
    tags: ["sender", "委托", "意图"],
  },
  "17": {
    title: "动态字段遮蔽",
    category: "对象权限",
    description: "检查用户可控 key 与受保护状态重叠时的动态字段 namespace 问题。",
    tags: ["动态字段", "namespace", "碰撞"],
  },
  "18": {
    title: "Epoch 奖励漂移",
    category: "会计逻辑",
    description: "分析只采样、不提交 epoch 边界时奖励累计如何发生漂移。",
    tags: ["epoch", "奖励", "舍入"],
  },
  "19": {
    title: "升级 Witness 缺口",
    category: "升级安全",
    description: "模拟升级后仍接受旧 witness 对象，导致旧权限继续生效。",
    tags: ["升级", "witness", "兼容性"],
  },
  "20": {
    title: "清算边界条件",
    category: "DeFi 数学",
    description: "寻找整数 health factor 舍入改变清算结果的边界。",
    tags: ["清算", "价格", "阈值"],
  },
};

export function challengeTitle(challenge: ChallengeMetadata, locale: Locale): string {
  return locale === "zh" ? challenge.titleZh ?? challengeZh[challenge.id]?.title ?? challenge.title : challenge.title;
}

export function challengeCategory(challenge: ChallengeMetadata, locale: Locale): string {
  return locale === "zh" ? challenge.categoryZh ?? challengeZh[challenge.id]?.category ?? challenge.category : challenge.category;
}

export function challengeDescription(challenge: ChallengeMetadata, locale: Locale): string {
  return locale === "zh" ? challenge.descriptionZh ?? challengeZh[challenge.id]?.description ?? challenge.description : challenge.description;
}

export function challengeTags(challenge: ChallengeMetadata, locale: Locale): string[] {
  return locale === "zh" ? challenge.tagsZh ?? challengeZh[challenge.id]?.tags ?? challenge.tags : challenge.tags;
}

export function formatDifficulty(difficulty: ChallengeDifficulty): string {
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
}
