#[allow(duplicate_alias)]
module suisec_dojo::challenge_18_epoch_reward_drift;

use sui::object::{Self, UID};
use sui::transfer;
use sui::tx_context::{Self, TxContext};
use suisec_dojo::challenge_events;
use suisec_dojo::user_progress::{Self, UserProgress};

public struct ChallengeInstance has key, store {
    id: UID,
    challenge_id: u64,
    owner: address,
    last_epoch: u64,
    rewards: u64,
    solved: bool,
}

const CHALLENGE_ID: u64 = 18;
const BASE_SCORE: u64 = 250;
const SOLVE_REWARD: u64 = 20;
const ENotOwner: u64 = 1;
const EAlreadySolved: u64 = 2;
const EInvalidSolution: u64 = 3;
const EInvalidInput: u64 = 4;

public fun new_instance(owner: address, ctx: &mut TxContext): ChallengeInstance {
    ChallengeInstance { id: object::new(ctx), challenge_id: CHALLENGE_ID, owner, last_epoch: 0, rewards: 0, solved: false }
}

public(package) entry fun claim(progress: &mut UserProgress, ctx: &mut TxContext) {
    let sender = tx_context::sender(ctx);
    user_progress::mark_claimed(progress, CHALLENGE_ID, sender);
    transfer::transfer(new_instance(sender, ctx), sender);
}

public(package) entry fun vulnerable_accrue(instance: &mut ChallengeInstance, observed_epoch: u64, repeats: u64) {
    // Intentionally vulnerable: rewards accrue repeatedly while last_epoch is never advanced.
    assert!(observed_epoch > instance.last_epoch, EInvalidInput);
    assert!(repeats > 0, EInvalidInput);
    instance.rewards = instance.rewards + ((observed_epoch - instance.last_epoch) * repeats);
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
    assert!(instance.rewards >= SOLVE_REWARD, EInvalidSolution);
    instance.solved = true;
    user_progress::mark_completed(progress, CHALLENGE_ID, sender);
    challenge_events::emit_completion(CHALLENGE_ID, sender, 0, BASE_SCORE, mode, assistance_level, ctx);
}

public fun challenge_id(instance: &ChallengeInstance): u64 { instance.challenge_id }
public fun owner(instance: &ChallengeInstance): address { instance.owner }
public fun last_epoch(instance: &ChallengeInstance): u64 { instance.last_epoch }
public fun rewards(instance: &ChallengeInstance): u64 { instance.rewards }
public fun is_solved(instance: &ChallengeInstance): bool { instance.solved }

#[test_only]
public fun new_instance_for_testing(owner: address, ctx: &mut TxContext): ChallengeInstance { new_instance(owner, ctx) }

#[test_only]
public fun destroy_for_testing(instance: ChallengeInstance) {
    let ChallengeInstance { id, challenge_id: _, owner: _, last_epoch: _, rewards: _, solved: _ } = instance;
    object::delete(id);
}
