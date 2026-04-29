#[allow(duplicate_alias)]
module suisec_dojo::challenge_17_dynamic_field_shadow;

use sui::object::{Self, UID};
use sui::transfer;
use sui::tx_context::{Self, TxContext};
use suisec_dojo::challenge_events;
use suisec_dojo::user_progress::{Self, UserProgress};

public struct ChallengeInstance has key, store {
    id: UID,
    challenge_id: u64,
    owner: address,
    trusted_key: u64,
    shadow_key: u64,
    shadow_written: bool,
    solved: bool,
}

const CHALLENGE_ID: u64 = 17;
const BASE_SCORE: u64 = 400;
const TRUSTED_KEY: u64 = 7;
const ENotOwner: u64 = 1;
const EAlreadySolved: u64 = 2;
const EInvalidSolution: u64 = 3;

public fun new_instance(owner: address, ctx: &mut TxContext): ChallengeInstance {
    ChallengeInstance {
        id: object::new(ctx),
        challenge_id: CHALLENGE_ID,
        owner,
        trusted_key: TRUSTED_KEY,
        shadow_key: 0,
        shadow_written: false,
        solved: false,
    }
}

public(package) entry fun claim(progress: &mut UserProgress, ctx: &mut TxContext) {
    let sender = tx_context::sender(ctx);
    user_progress::mark_claimed(progress, CHALLENGE_ID, sender);
    transfer::transfer(new_instance(sender, ctx), sender);
}

public(package) entry fun vulnerable_write_shadow(instance: &mut ChallengeInstance, key: u64) {
    // Intentionally vulnerable: a user-controlled key can shadow the privileged namespace key.
    instance.shadow_key = key;
    instance.shadow_written = key == instance.trusted_key;
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
    assert!(instance.shadow_written, EInvalidSolution);
    instance.solved = true;
    user_progress::mark_completed(progress, CHALLENGE_ID, sender);
    challenge_events::emit_completion(CHALLENGE_ID, sender, 0, BASE_SCORE, mode, assistance_level, ctx);
}

public fun challenge_id(instance: &ChallengeInstance): u64 { instance.challenge_id }
public fun owner(instance: &ChallengeInstance): address { instance.owner }
public fun trusted_key(instance: &ChallengeInstance): u64 { instance.trusted_key }
public fun shadow_key(instance: &ChallengeInstance): u64 { instance.shadow_key }
public fun shadow_written(instance: &ChallengeInstance): bool { instance.shadow_written }
public fun is_solved(instance: &ChallengeInstance): bool { instance.solved }

#[test_only]
public fun new_instance_for_testing(owner: address, ctx: &mut TxContext): ChallengeInstance { new_instance(owner, ctx) }

#[test_only]
public fun destroy_for_testing(instance: ChallengeInstance) {
    let ChallengeInstance { id, challenge_id: _, owner: _, trusted_key: _, shadow_key: _, shadow_written: _, solved: _ } = instance;
    object::delete(id);
}
