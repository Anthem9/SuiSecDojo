#[allow(duplicate_alias)]
module suisec_dojo::dojo_pass;

use std::bcs;
use std::vector;
use sui::balance::{Self, Balance};
use sui::coin::{Self, Coin};
use sui::ed25519;
use sui::event;
use sui::object::{Self, UID};
use sui::sui::SUI;
use sui::transfer;
use sui::tx_context::{Self, TxContext};
use suisec_dojo::badge::{Self, Badge};

public struct DojoPassConfig has key {
    id: UID,
    recipient: address,
    answer_price: u64,
    badge_price: u64,
    proof_public_key: vector<u8>,
    claimed_addresses: vector<address>,
    collected: Balance<SUI>,
}

public struct DojoPass has key {
    id: UID,
    owner: address,
    unlocked_challenges: vector<u64>,
    minted_badges: vector<u64>,
    membership_tier: u64,
    created_epoch: u64,
}

public struct AnswerUnlocked has copy, drop {
    owner: address,
    challenge_id: u64,
    amount: u64,
    epoch: u64,
}

public struct BadgeMinted has copy, drop {
    owner: address,
    badge_type: u64,
    amount: u64,
    epoch: u64,
}

public struct BadgeProof has copy, drop {
    owner: address,
    badge_type: u64,
    expires_epoch: u64,
    nonce: u64,
}

const EInvalidPrice: u64 = 0;
const EInsufficientPayment: u64 = 1;
const ENoFunds: u64 = 2;
const ENotRecipient: u64 = 3;
const EAlreadyMintedPass: u64 = 4;
const ENotPassOwner: u64 = 5;
const EAlreadyUnlocked: u64 = 6;
const EAlreadyMintedBadge: u64 = 7;
const EExpiredProof: u64 = 8;
const EInvalidProof: u64 = 9;
const ENotUnlocked: u64 = 10;

public fun create_config(
    recipient: address,
    answer_price: u64,
    badge_price: u64,
    proof_public_key: vector<u8>,
    ctx: &mut TxContext,
) {
    assert!(answer_price > 0 && badge_price > 0, EInvalidPrice);
    transfer::share_object(DojoPassConfig {
        id: object::new(ctx),
        recipient,
        answer_price,
        badge_price,
        proof_public_key,
        claimed_addresses: vector[],
        collected: balance::zero(),
    });
}

public fun mint_pass(config: &mut DojoPassConfig, ctx: &mut TxContext) {
    let owner = tx_context::sender(ctx);
    assert!(!vector::contains(&config.claimed_addresses, &owner), EAlreadyMintedPass);
    vector::push_back(&mut config.claimed_addresses, owner);
    transfer::transfer(DojoPass {
        id: object::new(ctx),
        owner,
        unlocked_challenges: vector[],
        minted_badges: vector[],
        membership_tier: 0,
        created_epoch: tx_context::epoch(ctx),
    }, owner);
}

public fun unlock_answer(
    config: &mut DojoPassConfig,
    pass: &mut DojoPass,
    challenge_id: u64,
    payment: Coin<SUI>,
    ctx: &mut TxContext,
) {
    let owner = tx_context::sender(ctx);
    assert!(pass.owner == owner, ENotPassOwner);
    assert!(!vector::contains(&pass.unlocked_challenges, &challenge_id), EAlreadyUnlocked);
    let amount = coin::value(&payment);
    assert!(amount >= config.answer_price, EInsufficientPayment);
    coin::put(&mut config.collected, payment);
    vector::push_back(&mut pass.unlocked_challenges, challenge_id);
    event::emit(AnswerUnlocked {
        owner,
        challenge_id,
        amount,
        epoch: tx_context::epoch(ctx),
    });
}

public fun seal_approve(pass: &DojoPass, challenge_id: u64, ctx: &TxContext) {
    assert!(pass.owner == tx_context::sender(ctx), ENotPassOwner);
    assert!(vector::contains(&pass.unlocked_challenges, &challenge_id), ENotUnlocked);
}

public fun mint_badge(
    config: &mut DojoPassConfig,
    pass: &mut DojoPass,
    badge_type: u64,
    expires_epoch: u64,
    nonce: u64,
    signature: vector<u8>,
    payment: Coin<SUI>,
    ctx: &mut TxContext,
): Badge {
    let owner = tx_context::sender(ctx);
    assert!(pass.owner == owner, ENotPassOwner);
    assert!(!vector::contains(&pass.minted_badges, &badge_type), EAlreadyMintedBadge);
    assert!(tx_context::epoch(ctx) <= expires_epoch, EExpiredProof);
    assert!(ed25519::ed25519_verify(&signature, &config.proof_public_key, &badge_proof_message(owner, badge_type, expires_epoch, nonce)), EInvalidProof);
    let amount = coin::value(&payment);
    assert!(amount >= config.badge_price, EInsufficientPayment);
    coin::put(&mut config.collected, payment);
    vector::push_back(&mut pass.minted_badges, badge_type);
    event::emit(BadgeMinted {
        owner,
        badge_type,
        amount,
        epoch: tx_context::epoch(ctx),
    });
    badge::mint_for_owner(owner, badge_type, ctx)
}

public fun withdraw(config: &mut DojoPassConfig, ctx: &mut TxContext): Coin<SUI> {
    let sender = tx_context::sender(ctx);
    assert!(sender == config.recipient, ENotRecipient);
    assert!(balance::value(&config.collected) > 0, ENoFunds);
    coin::from_balance(balance::withdraw_all(&mut config.collected), ctx)
}

public fun badge_proof_message(owner: address, badge_type: u64, expires_epoch: u64, nonce: u64): vector<u8> {
    bcs::to_bytes(&BadgeProof { owner, badge_type, expires_epoch, nonce })
}

public fun owner(pass: &DojoPass): address { pass.owner }
public fun membership_tier(pass: &DojoPass): u64 { pass.membership_tier }
public fun created_epoch(pass: &DojoPass): u64 { pass.created_epoch }
public fun has_unlocked_answer(pass: &DojoPass, challenge_id: u64): bool { vector::contains(&pass.unlocked_challenges, &challenge_id) }
public fun has_minted_badge(pass: &DojoPass, badge_type: u64): bool { vector::contains(&pass.minted_badges, &badge_type) }
public fun unlocked_count(pass: &DojoPass): u64 { vector::length(&pass.unlocked_challenges) }
public fun minted_badge_count(pass: &DojoPass): u64 { vector::length(&pass.minted_badges) }
public fun answer_price(config: &DojoPassConfig): u64 { config.answer_price }
public fun badge_price(config: &DojoPassConfig): u64 { config.badge_price }
public fun recipient(config: &DojoPassConfig): address { config.recipient }
public fun collected(config: &DojoPassConfig): u64 { balance::value(&config.collected) }
public fun has_claimed(config: &DojoPassConfig, owner: address): bool { vector::contains(&config.claimed_addresses, &owner) }

#[test_only]
public fun destroy_config_for_testing(config: DojoPassConfig) {
    let DojoPassConfig { id, recipient: _, answer_price: _, badge_price: _, proof_public_key: _, claimed_addresses: _, collected } = config;
    balance::destroy_zero(collected);
    object::delete(id);
}

#[test_only]
public fun destroy_pass_for_testing(pass: DojoPass) {
    let DojoPass { id, owner: _, unlocked_challenges: _, minted_badges: _, membership_tier: _, created_epoch: _ } = pass;
    object::delete(id);
}

#[test_only]
public fun return_pass_for_testing(pass: DojoPass, owner: address) {
    transfer::transfer(pass, owner);
}
