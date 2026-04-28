#[test_only]
module suisec_dojo::challenge_04_tests;

use sui::test_scenario;
use suisec_dojo::challenge_04_leaky_capability as challenge_04;
use suisec_dojo::user_progress::{Self, UserProgress};

const ALICE: address = @0xA11CE;
const BOB: address = @0xB0B;

#[test]
fun should_claim_instance_for_sender() {
    let mut scenario = test_scenario::begin(ALICE);
    {
        user_progress::create(test_scenario::ctx(&mut scenario));
    };

    test_scenario::next_tx(&mut scenario, ALICE);
    {
        let mut progress: UserProgress = test_scenario::take_from_sender(&scenario);
        challenge_04::claim(&mut progress, test_scenario::ctx(&mut scenario));
        assert!(user_progress::has_claimed(&progress, 4));
        test_scenario::return_to_sender(&scenario, progress);
    };

    test_scenario::next_tx(&mut scenario, ALICE);
    {
        let progress: UserProgress = test_scenario::take_from_sender(&scenario);
        let instance: challenge_04::ChallengeInstance = test_scenario::take_from_sender(&scenario);

        assert!(challenge_04::owner(&instance) == ALICE);
        assert!(challenge_04::challenge_id(&instance) == 4);
        assert!(!challenge_04::admin_flag(&instance));
        assert!(!challenge_04::cap_claimed(&instance));
        assert!(!challenge_04::is_solved(&instance));

        user_progress::destroy_for_testing(progress);
        challenge_04::destroy_instance_for_testing(instance);
    };
    test_scenario::end(scenario);
}

#[test]
fun should_leak_capability_to_sender() {
    let mut scenario = test_scenario::begin(BOB);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let mut instance = challenge_04::new_instance_for_testing(ALICE, ctx);

        challenge_04::vulnerable_claim_cap(&mut instance, ctx);
        assert!(challenge_04::cap_claimed(&instance));

        challenge_04::destroy_instance_for_testing(instance);
    };

    test_scenario::next_tx(&mut scenario, BOB);
    {
        let cap: challenge_04::AdminCap = test_scenario::take_from_sender(&scenario);
        assert!(challenge_04::cap_owner(&cap) == BOB);
        challenge_04::destroy_cap_for_testing(cap);
    };
    test_scenario::end(scenario);
}

#[test]
fun should_allow_cap_holder_to_set_admin_flag() {
    let mut scenario = test_scenario::begin(BOB);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let mut instance = challenge_04::new_instance_for_testing(ALICE, ctx);
        let cap = challenge_04::new_cap_for_testing(challenge_04::instance_id(&instance), BOB, ctx);

        challenge_04::admin_set_flag(&mut instance, &cap);
        assert!(challenge_04::admin_flag(&instance));

        challenge_04::destroy_cap_for_testing(cap);
        challenge_04::destroy_instance_for_testing(instance);
    };
    test_scenario::end(scenario);
}

#[test, expected_failure(abort_code = ::suisec_dojo::challenge_04_leaky_capability::EInvalidCap)]
fun should_reject_cap_for_another_instance() {
    let mut scenario = test_scenario::begin(BOB);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let mut instance = challenge_04::new_instance_for_testing(ALICE, ctx);
        let other = challenge_04::new_instance_for_testing(BOB, ctx);
        let cap = challenge_04::new_cap_for_testing(challenge_04::instance_id(&other), BOB, ctx);

        challenge_04::admin_set_flag(&mut instance, &cap);

        challenge_04::destroy_cap_for_testing(cap);
        challenge_04::destroy_instance_for_testing(other);
        challenge_04::destroy_instance_for_testing(instance);
    };
    test_scenario::end(scenario);
}

#[test]
fun should_solve_after_admin_flag_is_set() {
    let mut scenario = test_scenario::begin(ALICE);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let mut instance = challenge_04::new_instance_for_testing(ALICE, ctx);
        let mut progress = user_progress::new_for_owner(ALICE, ctx);
        let cap = challenge_04::new_cap_for_testing(challenge_04::instance_id(&instance), ALICE, ctx);

        challenge_04::admin_set_flag(&mut instance, &cap);
        challenge_04::solve(&mut instance, &mut progress, ctx);

        assert!(challenge_04::is_solved(&instance));
        assert!(user_progress::has_completed(&progress, 4));

        challenge_04::destroy_cap_for_testing(cap);
        challenge_04::destroy_instance_for_testing(instance);
        user_progress::destroy_for_testing(progress);
    };
    test_scenario::end(scenario);
}

#[test, expected_failure(abort_code = ::suisec_dojo::challenge_04_leaky_capability::EInvalidSolution)]
fun should_reject_solve_before_admin_flag_is_set() {
    let mut scenario = test_scenario::begin(ALICE);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let mut instance = challenge_04::new_instance_for_testing(ALICE, ctx);
        let mut progress = user_progress::new_for_owner(ALICE, ctx);

        challenge_04::solve(&mut instance, &mut progress, ctx);

        challenge_04::destroy_instance_for_testing(instance);
        user_progress::destroy_for_testing(progress);
    };
    test_scenario::end(scenario);
}

#[test, expected_failure(abort_code = ::suisec_dojo::challenge_04_leaky_capability::ENotOwner)]
fun should_reject_non_owner_solve_attempt() {
    let mut scenario = test_scenario::begin(BOB);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let mut instance = challenge_04::new_instance_for_testing(ALICE, ctx);
        let mut progress = user_progress::new_for_owner(ALICE, ctx);
        let cap = challenge_04::new_cap_for_testing(challenge_04::instance_id(&instance), BOB, ctx);

        challenge_04::admin_set_flag(&mut instance, &cap);
        challenge_04::solve(&mut instance, &mut progress, ctx);

        challenge_04::destroy_cap_for_testing(cap);
        challenge_04::destroy_instance_for_testing(instance);
        user_progress::destroy_for_testing(progress);
    };
    test_scenario::end(scenario);
}

#[test, expected_failure(abort_code = ::suisec_dojo::challenge_04_leaky_capability::EAlreadySolved)]
fun should_reject_duplicate_solve() {
    let mut scenario = test_scenario::begin(ALICE);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let mut instance = challenge_04::new_instance_for_testing(ALICE, ctx);
        let mut progress = user_progress::new_for_owner(ALICE, ctx);
        let cap = challenge_04::new_cap_for_testing(challenge_04::instance_id(&instance), ALICE, ctx);

        challenge_04::admin_set_flag(&mut instance, &cap);
        challenge_04::solve(&mut instance, &mut progress, ctx);
        challenge_04::solve(&mut instance, &mut progress, ctx);

        challenge_04::destroy_cap_for_testing(cap);
        challenge_04::destroy_instance_for_testing(instance);
        user_progress::destroy_for_testing(progress);
    };
    test_scenario::end(scenario);
}

