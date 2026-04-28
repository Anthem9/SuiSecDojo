#[allow(duplicate_alias, unused_use)]
module suisec_dojo::user_progress;

use std::vector;
use sui::object::{Self, UID};
use sui::tx_context::{Self, TxContext};

public struct UserProgress has key, store {
    id: UID,
    owner: address,
    completed_challenges: vector<u64>,
    badges: vector<u64>,
}

const ENotOwner: u64 = 1;
const EAlreadyCompleted: u64 = 2;
const EBadgeAlreadyRecorded: u64 = 3;

public fun new_for_owner(owner: address, ctx: &mut TxContext): UserProgress {
    UserProgress {
        id: object::new(ctx),
        owner,
        completed_challenges: vector[],
        badges: vector[],
    }
}

public fun owner(progress: &UserProgress): address {
    progress.owner
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

public fun has_badge(progress: &UserProgress, badge_type: u64): bool {
    vector::contains(&progress.badges, &badge_type)
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
    let UserProgress { id, owner: _, completed_challenges: _, badges: _ } = progress;
    object::delete(id);
}
