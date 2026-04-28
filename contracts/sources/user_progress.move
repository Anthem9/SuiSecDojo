#[allow(duplicate_alias, unused_use)]
module suisec_dojo::user_progress;

use std::vector;
use sui::object::{Self, UID};
use sui::transfer;
use sui::tx_context::{Self, TxContext};

public struct UserProgress has key, store {
    id: UID,
    owner: address,
    claimed_challenges: vector<u64>,
    completed_challenges: vector<u64>,
    badges: vector<u64>,
}

const ENotOwner: u64 = 1;
const EAlreadyCompleted: u64 = 2;
const EBadgeAlreadyRecorded: u64 = 3;
const EAlreadyClaimed: u64 = 4;

public fun new_for_owner(owner: address, ctx: &mut TxContext): UserProgress {
    UserProgress {
        id: object::new(ctx),
        owner,
        claimed_challenges: vector[],
        completed_challenges: vector[],
        badges: vector[],
    }
}

public(package) entry fun create(ctx: &mut TxContext) {
    let owner = tx_context::sender(ctx);
    let progress = new_for_owner(owner, ctx);
    transfer::transfer(progress, owner);
}

public fun owner(progress: &UserProgress): address {
    progress.owner
}

public fun claimed_count(progress: &UserProgress): u64 {
    vector::length(&progress.claimed_challenges)
}

public fun completed_count(progress: &UserProgress): u64 {
    vector::length(&progress.completed_challenges)
}

public fun badge_count(progress: &UserProgress): u64 {
    vector::length(&progress.badges)
}

public fun has_completed(progress: &UserProgress, challenge_id: u64): bool {
    vector::contains(&progress.completed_challenges, &challenge_id)
}

public fun has_claimed(progress: &UserProgress, challenge_id: u64): bool {
    vector::contains(&progress.claimed_challenges, &challenge_id)
}

public fun has_badge(progress: &UserProgress, badge_type: u64): bool {
    vector::contains(&progress.badges, &badge_type)
}

public fun mark_claimed(progress: &mut UserProgress, challenge_id: u64, sender: address) {
    assert!(progress.owner == sender, ENotOwner);
    assert!(!has_claimed(progress, challenge_id), EAlreadyClaimed);
    vector::push_back(&mut progress.claimed_challenges, challenge_id);
}

public fun mark_completed(progress: &mut UserProgress, challenge_id: u64, sender: address) {
    assert!(progress.owner == sender, ENotOwner);
    assert!(!has_completed(progress, challenge_id), EAlreadyCompleted);
    vector::push_back(&mut progress.completed_challenges, challenge_id);
}

public fun record_badge(progress: &mut UserProgress, badge_type: u64, sender: address) {
    assert!(progress.owner == sender, ENotOwner);
    assert!(!has_badge(progress, badge_type), EBadgeAlreadyRecorded);
    vector::push_back(&mut progress.badges, badge_type);
}

#[test_only]
public fun destroy_for_testing(progress: UserProgress) {
    let UserProgress { id, owner: _, claimed_challenges: _, completed_challenges: _, badges: _ } = progress;
    object::delete(id);
}
