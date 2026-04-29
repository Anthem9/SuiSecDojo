#[allow(duplicate_alias)]
module suisec_dojo::challenge_14_oracle_staleness;

use sui::object::{Self, UID};
use sui::transfer;
use sui::tx_context::{Self, TxContext};
use suisec_dojo::challenge_events;
use suisec_dojo::user_progress::{Self, UserProgress};

public struct ChallengeInstance has key, store {
    id: UID,
    challenge_id: u64,
    owner: address,
    stale_price_used: bool,
    observed_epoch: u64,
    solved: bool,
}

const CHALLENGE_ID: u64 = 14;
const BASE_SCORE: u64 = 400;
const FRESH_EPOCH: u64 = 10;
const ENotOwner: u64 = 1;
const EAlreadySolved: u64 = 2;
const EInvalidSolution: u64 = 3;
const EInvalidInput: u64 = 4;

public fun new_instance(owner: address, ctx: &mut TxContext): ChallengeInstance {
    ChallengeInstance { id: object::new(ctx), challenge_id: CHALLENGE_ID, owner, stale_price_used: false, observed_epoch: FRESH_EPOCH, solved: false }
}

public(package) entry fun claim(progress: &mut UserProgress, ctx: &mut TxContext) {
    let sender = tx_context::sender(ctx);
    user_progress::mark_claimed(progress, CHALLENGE_ID, sender);
    transfer::transfer(new_instance(sender, ctx), sender);
}

public(package) entry fun vulnerable_use_price(instance: &mut ChallengeInstance, checked_epoch: u64, price_epoch: u64) {
    // Intentionally vulnerable: checked_epoch is trusted even when the consumed price_epoch is stale.
    assert!(checked_epoch >= FRESH_EPOCH, EInvalidInput);
    instance.observed_epoch = price_epoch;
    instance.stale_price_used = price_epoch < checked_epoch;
}

public(package) entry fun solve(
    instance: &mut ChallengeInstance,
    progress: &mut UserProgress,
    mode: u8,
    assistance_level: u8,
    ctx: &TxContext,
) {
    let sender = tx_context::sender(ctx);
    assert!(instance.owner == sender, ENotOwner);
    assert!(!instance.solved, EAlreadySolved);
    assert!(instance.stale_price_used, EInvalidSolution);
    instance.solved = true;
    user_progress::mark_completed(progress, CHALLENGE_ID, sender);
    challenge_events::emit_completion(CHALLENGE_ID, sender, 0, BASE_SCORE, mode, assistance_level, ctx);
}

public fun challenge_id(instance: &ChallengeInstance): u64 { instance.challenge_id }
public fun owner(instance: &ChallengeInstance): address { instance.owner }
public fun stale_price_used(instance: &ChallengeInstance): bool { instance.stale_price_used }
public fun observed_epoch(instance: &ChallengeInstance): u64 { instance.observed_epoch }
public fun is_solved(instance: &ChallengeInstance): bool { instance.solved }

#[test_only]
public fun new_instance_for_testing(owner: address, ctx: &mut TxContext): ChallengeInstance { new_instance(owner, ctx) }

#[test_only]
public fun destroy_for_testing(instance: ChallengeInstance) {
    let ChallengeInstance { id, challenge_id: _, owner: _, stale_price_used: _, observed_epoch: _, solved: _ } = instance;
    object::delete(id);
}
