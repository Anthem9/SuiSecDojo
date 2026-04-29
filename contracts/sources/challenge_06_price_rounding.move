#[allow(duplicate_alias)]
module suisec_dojo::challenge_06_price_rounding;

use sui::object::{Self, UID};
use sui::transfer;
use sui::tx_context::{Self, TxContext};
use suisec_dojo::challenge_events;
use suisec_dojo::user_progress::{Self, UserProgress};

public struct ChallengeInstance has key, store {
    id: UID,
    challenge_id: u64,
    owner: address,
    paid_amount: u64,
    credits: u64,
    solved: bool,
}

const CHALLENGE_ID: u64 = 6;
const BASE_SCORE: u64 = 250;
const PRICE_PER_CREDIT: u64 = 10;
const SOLVE_CREDITS: u64 = 10;
const MAX_EXPLOIT_PAYMENT: u64 = 10;
const ENotOwner: u64 = 1;
const EAlreadySolved: u64 = 2;
const EInvalidSolution: u64 = 3;
const EInvalidPayment: u64 = 6;

public fun new_instance(owner: address, ctx: &mut TxContext): ChallengeInstance {
    ChallengeInstance {
        id: object::new(ctx),
        challenge_id: CHALLENGE_ID,
        owner,
        paid_amount: 0,
        credits: 0,
        solved: false,
    }
}

public(package) entry fun claim(progress: &mut UserProgress, ctx: &mut TxContext) {
    let sender = tx_context::sender(ctx);
    user_progress::mark_claimed(progress, CHALLENGE_ID, sender);
    transfer::transfer(new_instance(sender, ctx), sender);
}

public(package) entry fun vulnerable_buy(instance: &mut ChallengeInstance, payment: u64) {
    // Intentionally vulnerable: each tiny payment rounds up to one full credit.
    assert!(payment > 0, EInvalidPayment);
    let rounded_credits = (payment + PRICE_PER_CREDIT - 1) / PRICE_PER_CREDIT;
    instance.paid_amount = instance.paid_amount + payment;
    instance.credits = instance.credits + rounded_credits;
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
    assert!(instance.credits >= SOLVE_CREDITS, EInvalidSolution);
    assert!(instance.paid_amount <= MAX_EXPLOIT_PAYMENT, EInvalidSolution);

    instance.solved = true;
    user_progress::mark_completed(progress, CHALLENGE_ID, sender);
    challenge_events::emit_completion(CHALLENGE_ID, sender, 0, BASE_SCORE, mode, assistance_level, ctx);
}

public fun challenge_id(instance: &ChallengeInstance): u64 {
    instance.challenge_id
}

public fun owner(instance: &ChallengeInstance): address {
    instance.owner
}

public fun paid_amount(instance: &ChallengeInstance): u64 {
    instance.paid_amount
}

public fun credits(instance: &ChallengeInstance): u64 {
    instance.credits
}

public fun is_solved(instance: &ChallengeInstance): bool {
    instance.solved
}

#[test_only]
public fun price_per_credit_for_testing(): u64 {
    PRICE_PER_CREDIT
}

#[test_only]
public fun solve_credits_for_testing(): u64 {
    SOLVE_CREDITS
}

#[test_only]
public fun new_instance_for_testing(owner: address, ctx: &mut TxContext): ChallengeInstance {
    new_instance(owner, ctx)
}

#[test_only]
public fun destroy_for_testing(instance: ChallengeInstance) {
    let ChallengeInstance { id, challenge_id: _, owner: _, paid_amount: _, credits: _, solved: _ } = instance;
    object::delete(id);
}
