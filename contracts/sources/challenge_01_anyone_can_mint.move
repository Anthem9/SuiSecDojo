#[allow(duplicate_alias)]
module suisec_dojo::challenge_01_anyone_can_mint;

use sui::object::{Self, UID};
use sui::transfer;
use sui::tx_context::{Self, TxContext};
use suisec_dojo::badge;
use suisec_dojo::challenge_events;
use suisec_dojo::user_progress::{Self, UserProgress};

public struct ChallengeInstance has key, store {
    id: UID,
    challenge_id: u64,
    owner: address,
    minted_amount: u64,
    solved: bool,
}

const CHALLENGE_ID: u64 = 1;
const BADGE_TYPE_OBJECT_SECURITY: u64 = 1;
const BASE_SCORE: u64 = 100;
const SOLVE_THRESHOLD: u64 = 1_000;
const ENotOwner: u64 = 1;
const EAlreadySolved: u64 = 2;
const EInvalidSolution: u64 = 3;

public fun new_instance(owner: address, ctx: &mut TxContext): ChallengeInstance {
    ChallengeInstance {
        id: object::new(ctx),
        challenge_id: CHALLENGE_ID,
        owner,
        minted_amount: 0,
        solved: false,
    }
}

public fun challenge_id(instance: &ChallengeInstance): u64 {
    instance.challenge_id
}

public fun owner(instance: &ChallengeInstance): address {
    instance.owner
}

public fun minted_amount(instance: &ChallengeInstance): u64 {
    instance.minted_amount
}

public fun is_solved(instance: &ChallengeInstance): bool {
    instance.solved
}

public(package) entry fun claim(progress: &mut UserProgress, ctx: &mut TxContext) {
    let sender = tx_context::sender(ctx);
    // Phase 0 instance factory: each learner claims one owned challenge object.
    user_progress::mark_claimed(progress, CHALLENGE_ID, sender);
    transfer::transfer(new_instance(sender, ctx), sender);
}

public(package) entry fun vulnerable_mint(instance: &mut ChallengeInstance, amount: u64) {
    // Intentionally vulnerable: no capability or owner check protects this mint path.
    instance.minted_amount = instance.minted_amount + amount;
}

public(package) entry fun solve(
    instance: &mut ChallengeInstance,
    progress: &mut UserProgress,
    mode: u8,
    assistance_level: u8,
    ctx: &mut TxContext,
) {
    let sender = tx_context::sender(ctx);
    assert!(instance.owner == sender, ENotOwner);
    assert!(!instance.solved, EAlreadySolved);
    assert!(instance.minted_amount >= SOLVE_THRESHOLD, EInvalidSolution);

    instance.solved = true;
    user_progress::mark_completed(progress, CHALLENGE_ID, sender);
    if (!user_progress::has_badge(progress, BADGE_TYPE_OBJECT_SECURITY)) {
        user_progress::record_badge(progress, BADGE_TYPE_OBJECT_SECURITY, sender);
        transfer::public_transfer(badge::mint_for_owner(sender, BADGE_TYPE_OBJECT_SECURITY, ctx), sender);
    };
    challenge_events::emit_completion(CHALLENGE_ID, sender, BADGE_TYPE_OBJECT_SECURITY, BASE_SCORE, mode, assistance_level, ctx);
}

#[test_only]
public fun solve_threshold_for_testing(): u64 {
    SOLVE_THRESHOLD
}

#[test_only]
public fun destroy_for_testing(instance: ChallengeInstance) {
    let ChallengeInstance { id, challenge_id: _, owner: _, minted_amount: _, solved: _ } = instance;
    object::delete(id);
}
