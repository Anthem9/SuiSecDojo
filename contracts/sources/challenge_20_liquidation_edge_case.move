#[allow(duplicate_alias)]
module suisec_dojo::challenge_20_liquidation_edge_case;

use sui::object::{Self, UID};
use sui::transfer;
use sui::tx_context::{Self, TxContext};
use suisec_dojo::challenge_events;
use suisec_dojo::user_progress::{Self, UserProgress};

public struct ChallengeInstance has key, store {
    id: UID,
    challenge_id: u64,
    owner: address,
    collateral: u64,
    debt: u64,
    health: u64,
    liquidated: bool,
    solved: bool,
}

const CHALLENGE_ID: u64 = 20;
const BASE_SCORE: u64 = 400;
const INITIAL_COLLATERAL: u64 = 100;
const INITIAL_DEBT: u64 = 50;
const ENotOwner: u64 = 1;
const EAlreadySolved: u64 = 2;
const EInvalidSolution: u64 = 3;
const EInvalidInput: u64 = 4;

public fun new_instance(owner: address, ctx: &mut TxContext): ChallengeInstance {
    ChallengeInstance {
        id: object::new(ctx),
        challenge_id: CHALLENGE_ID,
        owner,
        collateral: INITIAL_COLLATERAL,
        debt: INITIAL_DEBT,
        health: (INITIAL_COLLATERAL * 25) / INITIAL_DEBT,
        liquidated: false,
        solved: false,
    }
}

public(package) entry fun claim(progress: &mut UserProgress, ctx: &mut TxContext) {
    let sender = tx_context::sender(ctx);
    user_progress::mark_claimed(progress, CHALLENGE_ID, sender);
    transfer::transfer(new_instance(sender, ctx), sender);
}

public(package) entry fun vulnerable_liquidate(instance: &mut ChallengeInstance, price: u64, threshold: u64) {
    // Intentionally vulnerable: the health factor uses coarse integer division near the threshold edge.
    assert!(price > 0 && threshold > 0, EInvalidInput);
    instance.health = (instance.collateral * price) / instance.debt;
    if (instance.health < threshold) {
        instance.liquidated = true;
    };
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
    assert!(instance.liquidated, EInvalidSolution);
    instance.solved = true;
    user_progress::mark_completed(progress, CHALLENGE_ID, sender);
    challenge_events::emit_completion(CHALLENGE_ID, sender, 0, BASE_SCORE, mode, assistance_level, ctx);
}

public fun challenge_id(instance: &ChallengeInstance): u64 { instance.challenge_id }
public fun owner(instance: &ChallengeInstance): address { instance.owner }
public fun collateral(instance: &ChallengeInstance): u64 { instance.collateral }
public fun debt(instance: &ChallengeInstance): u64 { instance.debt }
public fun health(instance: &ChallengeInstance): u64 { instance.health }
public fun liquidated(instance: &ChallengeInstance): bool { instance.liquidated }
public fun is_solved(instance: &ChallengeInstance): bool { instance.solved }

#[test_only]
public fun new_instance_for_testing(owner: address, ctx: &mut TxContext): ChallengeInstance { new_instance(owner, ctx) }

#[test_only]
public fun destroy_for_testing(instance: ChallengeInstance) {
    let ChallengeInstance { id, challenge_id: _, owner: _, collateral: _, debt: _, health: _, liquidated: _, solved: _ } = instance;
    object::delete(id);
}
