#[allow(duplicate_alias)]
module suisec_dojo::challenge_10_mini_amm_incident;

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
    reserve_x: u64,
    reserve_y: u64,
    attacker_profit: u64,
    invariant_broken: bool,
    solved: bool,
}

const CHALLENGE_ID: u64 = 10;
const CHALLENGE_ID_PRICE_ROUNDING: u64 = 6;
const BADGE_TYPE_DEFI_LOGIC: u64 = 4;
const BASE_SCORE: u64 = 400;
const INITIAL_RESERVE: u64 = 100;
const ENotOwner: u64 = 1;
const EAlreadySolved: u64 = 2;
const EInvalidSolution: u64 = 3;
const EInvalidInput: u64 = 10;

public fun new_instance(owner: address, ctx: &mut TxContext): ChallengeInstance {
    ChallengeInstance {
        id: object::new(ctx),
        challenge_id: CHALLENGE_ID,
        owner,
        reserve_x: INITIAL_RESERVE,
        reserve_y: INITIAL_RESERVE,
        attacker_profit: 0,
        invariant_broken: false,
        solved: false,
    }
}

public(package) entry fun claim(progress: &mut UserProgress, ctx: &mut TxContext) {
    let sender = tx_context::sender(ctx);
    user_progress::mark_claimed(progress, CHALLENGE_ID, sender);
    transfer::transfer(new_instance(sender, ctx), sender);
}

public(package) entry fun vulnerable_swap(instance: &mut ChallengeInstance, input_x: u64) {
    // Intentionally vulnerable: output is computed before reserves are updated and drains too much y.
    assert!(input_x > 0, EInvalidInput);
    let output_y = (input_x * instance.reserve_y) / instance.reserve_x;
    instance.reserve_x = instance.reserve_x + input_x;
    if (output_y >= instance.reserve_y) {
        instance.reserve_y = 0;
    } else {
        instance.reserve_y = instance.reserve_y - output_y;
    };
    instance.attacker_profit = instance.attacker_profit + output_y;
    instance.invariant_broken = instance.reserve_x * instance.reserve_y < INITIAL_RESERVE * INITIAL_RESERVE;
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
    assert!(instance.invariant_broken && instance.attacker_profit >= INITIAL_RESERVE, EInvalidSolution);
    instance.solved = true;
    user_progress::mark_completed(progress, CHALLENGE_ID, sender);
    if (
        user_progress::has_completed(progress, CHALLENGE_ID_PRICE_ROUNDING)
            && !user_progress::has_badge(progress, BADGE_TYPE_DEFI_LOGIC)
    ) {
        user_progress::record_badge(progress, BADGE_TYPE_DEFI_LOGIC, sender);
        transfer::public_transfer(badge::mint_for_owner(sender, BADGE_TYPE_DEFI_LOGIC, ctx), sender);
    };
    challenge_events::emit_completion(
        CHALLENGE_ID,
        sender,
        if (user_progress::has_badge(progress, BADGE_TYPE_DEFI_LOGIC)) { BADGE_TYPE_DEFI_LOGIC } else { 0 },
        BASE_SCORE,
        mode,
        assistance_level,
        ctx,
    );
}

public fun challenge_id(instance: &ChallengeInstance): u64 { instance.challenge_id }
public fun owner(instance: &ChallengeInstance): address { instance.owner }
public fun reserve_x(instance: &ChallengeInstance): u64 { instance.reserve_x }
public fun reserve_y(instance: &ChallengeInstance): u64 { instance.reserve_y }
public fun attacker_profit(instance: &ChallengeInstance): u64 { instance.attacker_profit }
public fun invariant_broken(instance: &ChallengeInstance): bool { instance.invariant_broken }
public fun is_solved(instance: &ChallengeInstance): bool { instance.solved }

#[test_only]
public fun new_instance_for_testing(owner: address, ctx: &mut TxContext): ChallengeInstance { new_instance(owner, ctx) }

#[test_only]
public fun destroy_for_testing(instance: ChallengeInstance) {
    let ChallengeInstance {
        id,
        challenge_id: _,
        owner: _,
        reserve_x: _,
        reserve_y: _,
        attacker_profit: _,
        invariant_broken: _,
        solved: _,
    } = instance;
    object::delete(id);
}
