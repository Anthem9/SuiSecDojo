#[allow(duplicate_alias)]
module suisec_dojo::challenge_07_overflow_guard;

use sui::object::{Self, UID};
use sui::transfer;
use sui::tx_context::{Self, TxContext};
use suisec_dojo::challenge_events;
use suisec_dojo::user_progress::{Self, UserProgress};

public struct ChallengeInstance has key, store {
    id: UID,
    challenge_id: u64,
    owner: address,
    guarded_value: u64,
    solved: bool,
}

const CHALLENGE_ID: u64 = 7;
const SAFE_LIMIT: u64 = 100;
const SOLVE_VALUE: u64 = 1_000;
const ENotOwner: u64 = 1;
const EAlreadySolved: u64 = 2;
const EInvalidSolution: u64 = 3;

public fun new_instance(owner: address, ctx: &mut TxContext): ChallengeInstance {
    ChallengeInstance { id: object::new(ctx), challenge_id: CHALLENGE_ID, owner, guarded_value: 0, solved: false }
}

public(package) entry fun claim(progress: &mut UserProgress, ctx: &mut TxContext) {
    let sender = tx_context::sender(ctx);
    user_progress::mark_claimed(progress, CHALLENGE_ID, sender);
    transfer::transfer(new_instance(sender, ctx), sender);
}

public(package) entry fun vulnerable_set_value(instance: &mut ChallengeInstance, value: u64) {
    // Intentionally vulnerable: the guard checks old state, not the incoming value.
    assert!(instance.guarded_value < SAFE_LIMIT, EInvalidSolution);
    instance.guarded_value = value;
}

public(package) entry fun solve(instance: &mut ChallengeInstance, progress: &mut UserProgress, ctx: &TxContext) {
    let sender = tx_context::sender(ctx);
    assert!(instance.owner == sender, ENotOwner);
    assert!(!instance.solved, EAlreadySolved);
    assert!(instance.guarded_value >= SOLVE_VALUE, EInvalidSolution);
    instance.solved = true;
    user_progress::mark_completed(progress, CHALLENGE_ID, sender);
    challenge_events::emit_completion(CHALLENGE_ID, sender, 0, ctx);
}

public fun challenge_id(instance: &ChallengeInstance): u64 { instance.challenge_id }
public fun owner(instance: &ChallengeInstance): address { instance.owner }
public fun guarded_value(instance: &ChallengeInstance): u64 { instance.guarded_value }
public fun is_solved(instance: &ChallengeInstance): bool { instance.solved }

#[test_only]
public fun new_instance_for_testing(owner: address, ctx: &mut TxContext): ChallengeInstance { new_instance(owner, ctx) }

#[test_only]
public fun destroy_for_testing(instance: ChallengeInstance) {
    let ChallengeInstance { id, challenge_id: _, owner: _, guarded_value: _, solved: _ } = instance;
    object::delete(id);
}
