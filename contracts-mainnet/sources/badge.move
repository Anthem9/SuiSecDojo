#[allow(duplicate_alias)]
module suisec_dojo::badge;

use sui::object::{Self, UID};
use sui::tx_context::{Self, TxContext};

public struct Badge has key, store {
    id: UID,
    owner: address,
    badge_type: u64,
    issued_at_epoch: u64,
}

public fun mint_for_owner(owner: address, badge_type: u64, ctx: &mut TxContext): Badge {
    Badge {
        id: object::new(ctx),
        owner,
        badge_type,
        issued_at_epoch: tx_context::epoch(ctx),
    }
}

public fun owner(badge: &Badge): address {
    badge.owner
}

public fun badge_type(badge: &Badge): u64 {
    badge.badge_type
}

public fun issued_at_epoch(badge: &Badge): u64 {
    badge.issued_at_epoch
}

#[test_only]
public fun destroy_for_testing(badge: Badge) {
    let Badge { id, owner: _, badge_type: _, issued_at_epoch: _ } = badge;
    object::delete(id);
}
