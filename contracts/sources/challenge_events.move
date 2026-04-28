#[allow(duplicate_alias)]
module suisec_dojo::challenge_events;

use sui::event;
use sui::tx_context::{Self, TxContext};

public struct ChallengeCompleted has copy, drop {
    challenge_id: u64,
    solver: address,
    epoch: u64,
    badge_type: u64,
}

public fun emit_completion(challenge_id: u64, solver: address, badge_type: u64, ctx: &TxContext) {
    event::emit(ChallengeCompleted {
        challenge_id,
        solver,
        epoch: tx_context::epoch(ctx),
        badge_type,
    });
}

#[test_only]
public fun challenge_id(event: &ChallengeCompleted): u64 {
    event.challenge_id
}

#[test_only]
public fun solver(event: &ChallengeCompleted): address {
    event.solver
}

#[test_only]
public fun badge_type(event: &ChallengeCompleted): u64 {
    event.badge_type
}
