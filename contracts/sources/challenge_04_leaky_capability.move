#[allow(duplicate_alias)]
module suisec_dojo::challenge_04_leaky_capability;

use sui::object::{Self, ID, UID};
use sui::transfer;
use sui::tx_context::{Self, TxContext};
use suisec_dojo::badge;
use suisec_dojo::challenge_events;
use suisec_dojo::user_progress::{Self, UserProgress};

public struct ChallengeInstance has key, store {
    id: UID,
    challenge_id: u64,
    owner: address,
    cap_claimed: bool,
    admin_flag: bool,
    solved: bool,
}

public struct AdminCap has key, store {
    id: UID,
    instance_id: ID,
    owner: address,
}

const CHALLENGE_ID: u64 = 4;
const BADGE_TYPE_CAPABILITY_PATTERN: u64 = 3;
const ENotOwner: u64 = 1;
const EAlreadySolved: u64 = 2;
const EInvalidSolution: u64 = 3;
const EInvalidCap: u64 = 4;
const ECapAlreadyClaimed: u64 = 5;

public fun new_instance(owner: address, ctx: &mut TxContext): ChallengeInstance {
    ChallengeInstance {
        id: object::new(ctx),
        challenge_id: CHALLENGE_ID,
        owner,
        cap_claimed: false,
        admin_flag: false,
        solved: false,
    }
}

public(package) entry fun claim(progress: &mut UserProgress, ctx: &mut TxContext) {
    let sender = tx_context::sender(ctx);
    user_progress::mark_claimed(progress, CHALLENGE_ID, sender);
    transfer::transfer(new_instance(sender, ctx), sender);
}

public(package) entry fun vulnerable_claim_cap(instance: &mut ChallengeInstance, ctx: &mut TxContext) {
    // Intentionally vulnerable: any caller can claim the admin capability for this instance.
    assert!(!instance.cap_claimed, ECapAlreadyClaimed);
    let sender = tx_context::sender(ctx);
    let cap = AdminCap {
        id: object::new(ctx),
        instance_id: object::id(instance),
        owner: sender,
    };
    instance.cap_claimed = true;
    transfer::transfer(cap, sender);
}

public(package) entry fun admin_set_flag(instance: &mut ChallengeInstance, cap: &AdminCap) {
    assert!(cap.instance_id == object::id(instance), EInvalidCap);
    instance.admin_flag = true;
}

public(package) entry fun solve(instance: &mut ChallengeInstance, progress: &mut UserProgress, ctx: &mut TxContext) {
    let sender = tx_context::sender(ctx);
    assert!(instance.owner == sender, ENotOwner);
    assert!(!instance.solved, EAlreadySolved);
    assert!(instance.admin_flag, EInvalidSolution);

    instance.solved = true;
    user_progress::mark_completed(progress, CHALLENGE_ID, sender);
    if (!user_progress::has_badge(progress, BADGE_TYPE_CAPABILITY_PATTERN)) {
        user_progress::record_badge(progress, BADGE_TYPE_CAPABILITY_PATTERN, sender);
        transfer::public_transfer(badge::mint_for_owner(sender, BADGE_TYPE_CAPABILITY_PATTERN, ctx), sender);
    };
    challenge_events::emit_completion(CHALLENGE_ID, sender, BADGE_TYPE_CAPABILITY_PATTERN, ctx);
}

public fun challenge_id(instance: &ChallengeInstance): u64 {
    instance.challenge_id
}

public fun instance_id(instance: &ChallengeInstance): ID {
    object::id(instance)
}

public fun owner(instance: &ChallengeInstance): address {
    instance.owner
}

public fun cap_claimed(instance: &ChallengeInstance): bool {
    instance.cap_claimed
}

public fun admin_flag(instance: &ChallengeInstance): bool {
    instance.admin_flag
}

public fun is_solved(instance: &ChallengeInstance): bool {
    instance.solved
}

public fun cap_owner(cap: &AdminCap): address {
    cap.owner
}

#[test_only]
public fun new_instance_for_testing(owner: address, ctx: &mut TxContext): ChallengeInstance {
    new_instance(owner, ctx)
}

#[test_only]
public fun new_cap_for_testing(instance_id: ID, owner: address, ctx: &mut TxContext): AdminCap {
    AdminCap {
        id: object::new(ctx),
        instance_id,
        owner,
    }
}

#[test_only]
public fun destroy_instance_for_testing(instance: ChallengeInstance) {
    let ChallengeInstance { id, challenge_id: _, owner: _, cap_claimed: _, admin_flag: _, solved: _ } = instance;
    object::delete(id);
}

#[test_only]
public fun destroy_cap_for_testing(cap: AdminCap) {
    let AdminCap { id, instance_id: _, owner: _ } = cap;
    object::delete(id);
}
