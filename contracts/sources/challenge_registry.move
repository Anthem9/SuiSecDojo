#[allow(duplicate_alias)]
module suisec_dojo::challenge_registry;

use std::vector;
use sui::object::{Self, UID};
use sui::transfer;
use sui::tx_context::{Self, TxContext};

public struct ChallengeRegistry has key {
    id: UID,
    admin: address,
    challenges: vector<ChallengeInfo>,
}

public struct ChallengeInfo has store, copy, drop {
    challenge_id: u64,
    title: vector<u8>,
    difficulty: u8,
    category: vector<u8>,
    walrus_blob_id: vector<u8>,
    enabled: bool,
}

const ENotAdmin: u64 = 1;
const EChallengeAlreadyRegistered: u64 = 2;
const EChallengeNotFound: u64 = 3;

public fun new_for_admin(admin: address, ctx: &mut TxContext): ChallengeRegistry {
    ChallengeRegistry {
        id: object::new(ctx),
        admin,
        challenges: vector[],
    }
}

public(package) entry fun init_registry(ctx: &mut TxContext) {
    let admin = tx_context::sender(ctx);
    transfer::transfer(new_for_admin(admin, ctx), admin);
}

public(package) entry fun register_challenge(
    registry: &mut ChallengeRegistry,
    challenge_id: u64,
    title: vector<u8>,
    difficulty: u8,
    category: vector<u8>,
    walrus_blob_id: vector<u8>,
    enabled: bool,
    ctx: &TxContext,
) {
    assert_admin(registry, tx_context::sender(ctx));
    assert!(!contains_challenge(registry, challenge_id), EChallengeAlreadyRegistered);

    vector::push_back(
        &mut registry.challenges,
        ChallengeInfo {
            challenge_id,
            title,
            difficulty,
            category,
            walrus_blob_id,
            enabled,
        },
    );
}

public(package) entry fun set_enabled(
    registry: &mut ChallengeRegistry,
    challenge_id: u64,
    enabled: bool,
    ctx: &TxContext,
) {
    assert_admin(registry, tx_context::sender(ctx));
    let index = find_challenge_index(registry, challenge_id);
    let challenge = vector::borrow_mut(&mut registry.challenges, index);
    challenge.enabled = enabled;
}

public fun admin(registry: &ChallengeRegistry): address {
    registry.admin
}

public fun challenge_count(registry: &ChallengeRegistry): u64 {
    vector::length(&registry.challenges)
}

public fun is_enabled(registry: &ChallengeRegistry, challenge_id: u64): bool {
    let length = vector::length(&registry.challenges);
    let mut index = 0;
    while (index < length) {
        let challenge = vector::borrow(&registry.challenges, index);
        if (challenge.challenge_id == challenge_id) {
            return challenge.enabled
        };
        index = index + 1;
    };
    false
}

fun assert_admin(registry: &ChallengeRegistry, sender: address) {
    assert!(registry.admin == sender, ENotAdmin);
}

fun contains_challenge(registry: &ChallengeRegistry, challenge_id: u64): bool {
    let length = vector::length(&registry.challenges);
    let mut index = 0;
    while (index < length) {
        if (vector::borrow(&registry.challenges, index).challenge_id == challenge_id) {
            return true
        };
        index = index + 1;
    };
    false
}

fun find_challenge_index(registry: &ChallengeRegistry, challenge_id: u64): u64 {
    let length = vector::length(&registry.challenges);
    let mut index = 0;
    while (index < length) {
        if (vector::borrow(&registry.challenges, index).challenge_id == challenge_id) {
            return index
        };
        index = index + 1;
    };
    abort EChallengeNotFound
}

#[test_only]
public fun destroy_for_testing(registry: ChallengeRegistry) {
    let ChallengeRegistry { id, admin: _, challenges: _ } = registry;
    object::delete(id);
}
