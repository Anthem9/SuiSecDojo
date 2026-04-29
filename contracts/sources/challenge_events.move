#[allow(duplicate_alias)]
module suisec_dojo::challenge_events;

use sui::event;
use sui::tx_context::{Self, TxContext};
use suisec_dojo::challenge_scoring;

public struct ChallengeCompleted has copy, drop {
    challenge_id: u64,
    solver: address,
    epoch: u64,
    badge_type: u64,
    mode: u8,
    assistance_level: u8,
    score: u64,
}

public fun emit_completion(
    challenge_id: u64,
    solver: address,
    badge_type: u64,
    base_score: u64,
    mode: u8,
    assistance_level: u8,
    ctx: &TxContext,
) {
    event::emit(ChallengeCompleted {
        challenge_id,
        solver,
        epoch: tx_context::epoch(ctx),
        badge_type,
        mode,
        assistance_level,
        score: challenge_scoring::calculate(base_score, mode, assistance_level),
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

#[test_only]
public fun mode(event: &ChallengeCompleted): u8 {
    event.mode
}

#[test_only]
public fun assistance_level(event: &ChallengeCompleted): u8 {
    event.assistance_level
}

#[test_only]
public fun score(event: &ChallengeCompleted): u64 {
    event.score
}
