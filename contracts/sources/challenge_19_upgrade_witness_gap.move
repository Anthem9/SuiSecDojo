#[allow(duplicate_alias)]
module suisec_dojo::challenge_19_upgrade_witness_gap;

use sui::object::{Self, ID, UID};
use sui::transfer;
use sui::tx_context::{Self, TxContext};
use suisec_dojo::challenge_events;
use suisec_dojo::user_progress::{Self, UserProgress};

public struct ChallengeInstance has key, store {
    id: UID,
    challenge_id: u64,
    owner: address,
    old_witness_used: bool,
    solved: bool,
}

public struct OldWitness has key, store {
    id: UID,
    instance_id: ID,
    owner: address,
}

const CHALLENGE_ID: u64 = 19;
const BASE_SCORE: u64 = 400;
const ENotOwner: u64 = 1;
const EAlreadySolved: u64 = 2;
const EInvalidSolution: u64 = 3;
const EWrongWitness: u64 = 4;

public fun new_instance(owner: address, ctx: &mut TxContext): ChallengeInstance {
    ChallengeInstance { id: object::new(ctx), challenge_id: CHALLENGE_ID, owner, old_witness_used: false, solved: false }
}

public(package) entry fun claim(progress: &mut UserProgress, ctx: &mut TxContext) {
    let sender = tx_context::sender(ctx);
    user_progress::mark_claimed(progress, CHALLENGE_ID, sender);
    transfer::transfer(new_instance(sender, ctx), sender);
}

public(package) entry fun vulnerable_mint_old_witness(instance: &ChallengeInstance, ctx: &mut TxContext) {
    // Intentionally vulnerable: obsolete authority can still be minted by any caller for this instance.
    let sender = tx_context::sender(ctx);
    transfer::transfer(OldWitness { id: object::new(ctx), instance_id: object::id(instance), owner: sender }, sender);
}

public(package) entry fun old_admin_path(instance: &mut ChallengeInstance, witness: &OldWitness) {
    assert!(witness.instance_id == object::id(instance), EWrongWitness);
    instance.old_witness_used = true;
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
    assert!(instance.old_witness_used, EInvalidSolution);
    instance.solved = true;
    user_progress::mark_completed(progress, CHALLENGE_ID, sender);
    challenge_events::emit_completion(CHALLENGE_ID, sender, 0, BASE_SCORE, mode, assistance_level, ctx);
}

public fun challenge_id(instance: &ChallengeInstance): u64 { instance.challenge_id }
public fun owner(instance: &ChallengeInstance): address { instance.owner }
public fun old_witness_used(instance: &ChallengeInstance): bool { instance.old_witness_used }
public fun is_solved(instance: &ChallengeInstance): bool { instance.solved }
public fun witness_owner(witness: &OldWitness): address { witness.owner }

#[test_only]
public fun new_instance_for_testing(owner: address, ctx: &mut TxContext): ChallengeInstance { new_instance(owner, ctx) }

#[test_only]
public fun new_old_witness_for_testing(instance: &ChallengeInstance, ctx: &mut TxContext): OldWitness {
    OldWitness { id: object::new(ctx), instance_id: object::id(instance), owner: instance.owner }
}

#[test_only]
public fun destroy_for_testing(instance: ChallengeInstance) {
    let ChallengeInstance { id, challenge_id: _, owner: _, old_witness_used: _, solved: _ } = instance;
    object::delete(id);
}

#[test_only]
public fun destroy_witness_for_testing(witness: OldWitness) {
    let OldWitness { id, instance_id: _, owner: _ } = witness;
    object::delete(id);
}
