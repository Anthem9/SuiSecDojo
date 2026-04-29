#[allow(duplicate_alias)]
module suisec_dojo::paid_access;

use sui::balance::{Self, Balance};
use sui::coin::{Self, Coin};
use sui::event;
use sui::object::{Self, ID, UID};
use sui::sui::SUI;
use sui::tx_context::{Self, TxContext};

public struct PaidAccessConfig has key {
    id: UID,
    recipient: address,
    answer_price: u64,
    badge_price: u64,
    collected: Balance<SUI>,
}

public struct AnswerReceipt has key, store {
    id: UID,
    owner: address,
    challenge_id: u64,
    paid_at_epoch: u64,
}

public struct PublicBadge has key, store {
    id: UID,
    owner: address,
    badge_type: u64,
    paid_at_epoch: u64,
}

public struct AnswerUnlocked has copy, drop {
    owner: address,
    challenge_id: u64,
    amount: u64,
    epoch: u64,
}

public struct PublicBadgeMinted has copy, drop {
    owner: address,
    badge_type: u64,
    amount: u64,
    epoch: u64,
}

const EInvalidPrice: u64 = 0;
const EInsufficientPayment: u64 = 1;
const ENoFunds: u64 = 2;
const ENotRecipient: u64 = 3;

public fun create_config(recipient: address, answer_price: u64, badge_price: u64, ctx: &mut TxContext) {
    assert!(answer_price > 0 && badge_price > 0, EInvalidPrice);
    transfer::share_object(PaidAccessConfig {
        id: object::new(ctx),
        recipient,
        answer_price,
        badge_price,
        collected: balance::zero(),
    });
}

public fun unlock_answer(config: &mut PaidAccessConfig, challenge_id: u64, payment: Coin<SUI>, ctx: &mut TxContext): AnswerReceipt {
    let amount = coin::value(&payment);
    assert!(amount >= config.answer_price, EInsufficientPayment);
    coin::put(&mut config.collected, payment);
    let owner = tx_context::sender(ctx);
    event::emit(AnswerUnlocked {
        owner,
        challenge_id,
        amount,
        epoch: tx_context::epoch(ctx),
    });
    AnswerReceipt {
        id: object::new(ctx),
        owner,
        challenge_id,
        paid_at_epoch: tx_context::epoch(ctx),
    }
}

public fun mint_public_badge(config: &mut PaidAccessConfig, badge_type: u64, payment: Coin<SUI>, ctx: &mut TxContext): PublicBadge {
    let amount = coin::value(&payment);
    assert!(amount >= config.badge_price, EInsufficientPayment);
    coin::put(&mut config.collected, payment);
    let owner = tx_context::sender(ctx);
    event::emit(PublicBadgeMinted {
        owner,
        badge_type,
        amount,
        epoch: tx_context::epoch(ctx),
    });
    PublicBadge {
        id: object::new(ctx),
        owner,
        badge_type,
        paid_at_epoch: tx_context::epoch(ctx),
    }
}

public fun withdraw(config: &mut PaidAccessConfig, ctx: &mut TxContext): Coin<SUI> {
    let sender = tx_context::sender(ctx);
    assert!(sender == config.recipient, ENotRecipient);
    assert!(balance::value(&config.collected) > 0, ENoFunds);
    coin::from_balance(balance::withdraw_all(&mut config.collected), ctx)
}

public fun answer_price(config: &PaidAccessConfig): u64 {
    config.answer_price
}

public fun badge_price(config: &PaidAccessConfig): u64 {
    config.badge_price
}

public fun recipient(config: &PaidAccessConfig): address {
    config.recipient
}

public fun collected(config: &PaidAccessConfig): u64 {
    balance::value(&config.collected)
}

public fun receipt_owner(receipt: &AnswerReceipt): address {
    receipt.owner
}

public fun receipt_challenge_id(receipt: &AnswerReceipt): u64 {
    receipt.challenge_id
}

public fun public_badge_owner(badge: &PublicBadge): address {
    badge.owner
}

public fun public_badge_type(badge: &PublicBadge): u64 {
    badge.badge_type
}

public fun config_id(config: &PaidAccessConfig): ID {
    object::id(config)
}

#[test_only]
public fun destroy_config_for_testing(config: PaidAccessConfig) {
    let PaidAccessConfig { id, recipient: _, answer_price: _, badge_price: _, collected } = config;
    balance::destroy_zero(collected);
    object::delete(id);
}

#[test_only]
public fun destroy_receipt_for_testing(receipt: AnswerReceipt) {
    let AnswerReceipt { id, owner: _, challenge_id: _, paid_at_epoch: _ } = receipt;
    object::delete(id);
}

#[test_only]
public fun destroy_public_badge_for_testing(badge: PublicBadge) {
    let PublicBadge { id, owner: _, badge_type: _, paid_at_epoch: _ } = badge;
    object::delete(id);
}
