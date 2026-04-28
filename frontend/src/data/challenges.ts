import type { ChallengeMetadata } from "../types";

export const challenges: ChallengeMetadata[] = [
  {
    id: "1",
    title: "Anyone Can Mint",
    slug: "anyone-can-mint",
    difficulty: "beginner",
    category: "Object Security",
    tags: ["TreasuryCap", "AdminCap", "public entry"],
    description: "Exploit an unrestricted mint entry to create enough challenge coin and solve the instance.",
    moduleName: "challenge_01_anyone_can_mint",
    sourceUrl: "content/challenges/01-anyone-can-mint/statement.md",
  },
  {
    id: "2",
    title: "Shared Vault",
    slug: "shared-vault",
    difficulty: "easy",
    category: "Shared Object",
    tags: ["Shared Object", "withdraw", "authorization"],
    description: "Abuse a shared vault withdraw function that does not verify the vault owner.",
    moduleName: "challenge_02_shared_vault",
    sourceUrl: "content/challenges/02-shared-vault/statement.md",
  },
  {
    id: "3",
    title: "Fake Owner",
    slug: "fake-owner",
    difficulty: "easy",
    category: "Authorization",
    tags: ["tx_context::sender", "owner", "address"],
    description: "Bypass authorization by passing a forged owner address into a vulnerable entry function.",
    moduleName: "challenge_03_fake_owner",
    sourceUrl: "content/challenges/03-fake-owner/statement.md",
  },
];
