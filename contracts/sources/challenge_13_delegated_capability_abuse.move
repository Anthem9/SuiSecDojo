#[allow(duplicate_alias)]
module suisec_dojo::challenge_13_delegated_capability_abuse;

use sui::object::{Self, ID, UID};
use sui::transfer;
use sui::tx_context::{Self, TxContext};
use suisec_dojo::challenge_events;
use suisec_dojo::user_progress::{Self, UserProgress};

public struct ChallengeInstance has key, store {
    id: UID,
    challenge_id: u64,
    owner: address,
    privileged_flag: bool,
    solved: bool,
}

public struct DelegatedCap has key, store {
    id: UID,
    instance_id: ID,
    owner: address,
    scope: u64,
}

const CHALLENGE_ID: u64 = 13;
const BASE_SCORE: u64 = 400;
const ENotOwner: u64 = 1;
const EAlreadySolved: u64 = 2;
const EInvalidSolution: u64 = 3;
const EWrongCap: u64 = 4;

public fun new_instance(owner: address, ctx: &mut TxContext): ChallengeInstance {
    ChallengeInstance { id: object::new(ctx), challenge_id: CHALLENGE_ID, owner, privileged_flag: false, solved: false }
}

public(package) entry fun claim(progress: &mut UserProgress, ctx: &mut TxContext) {
    let sender = tx_context::sender(ctx);
    user_progress::mark_claimed(progress, CHALLENGE_ID, sender);
    transfer::transfer(new_instance(sender, ctx), sender);
}

public(package) entry fun vulnerable_delegate_cap(instance: &ChallengeInstance, ctx: &mut TxContext) {
    // Intentionally vulnerable: scope 0 is treated as universal delegation.
    let sender = tx_context::sender(ctx);
    transfer::transfer(DelegatedCap { id: object::new(ctx), instance_id: object::id(instance), owner: sender, scope: 0 }, sender);
}

public(package) entry fun privileged_set_flag(instance: &mut ChallengeInstance, cap: &DelegatedCap) {
    assert!(cap.scope == 0 || cap.instance_id == object::id(instance), EWrongCap);
    instance.privileged_flag = true;
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
    assert!(instance.privileged_flag, EInvalidSolution);
    instance.solved = true;
    user_progress::mark_completed(progress, CHALLENGE_ID, sender);
    challenge_events::emit_completion(CHALLENGE_ID, sender, 0, BASE_SCORE, mode, assistance_level, ctx);
}

public fun challenge_id(instance: &ChallengeInstance): u64 { instance.challenge_id }
public fun owner(instance: &ChallengeInstance): address { instance.owner }
public fun privileged_flag(instance: &ChallengeInstance): bool { instance.privileged_flag }
public fun is_solved(instance: &ChallengeInstance): bool { instance.solved }
public fun cap_owner(cap: &DelegatedCap): address { cap.owner }
public fun cap_scope(cap: &DelegatedCap): u64 { cap.scope }

#[test_only]
public fun new_instance_for_testing(owner: address, ctx: &mut TxContext): ChallengeInstance { new_instance(owner, ctx) }

#[test_only]
public fun new_cap_for_testing(instance: &ChallengeInstance, owner: address, scope: u64, ctx: &mut TxContext): DelegatedCap {
    DelegatedCap { id: object::new(ctx), instance_id: object::id(instance), owner, scope }
}

#[test_only]
public fun destroy_for_testing(instance: ChallengeInstance) {
    let ChallengeInstance { id, challenge_id: _, owner: _, privileged_flag: _, solved: _ } = instance;
    object::delete(id);
}

#[test_only]
public fun destroy_cap_for_testing(cap: DelegatedCap) {
    let DelegatedCap { id, instance_id: _, owner: _, scope: _ } = cap;
    object::delete(id);
}
