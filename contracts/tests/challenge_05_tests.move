#[test_only]
module suisec_dojo::challenge_05_tests;

use sui::test_scenario;
use suisec_dojo::challenge_05_bad_init as challenge_05;
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
        challenge_05::claim(&mut progress, test_scenario::ctx(&mut scenario));
        assert!(user_progress::has_claimed(&progress, 5));
        test_scenario::return_to_sender(&scenario, progress);
    };

    test_scenario::next_tx(&mut scenario, ALICE);
    {
        let progress: UserProgress = test_scenario::take_from_sender(&scenario);
        let instance: challenge_05::ChallengeInstance = test_scenario::take_from_sender(&scenario);

        assert!(challenge_05::owner(&instance) == ALICE);
        assert!(challenge_05::challenge_id(&instance) == 5);
        assert!(!challenge_05::admin_cap_created(&instance));
        assert!(!challenge_05::initialized(&instance));
        assert!(!challenge_05::is_solved(&instance));

        user_progress::destroy_for_testing(progress);
        challenge_05::destroy_instance_for_testing(instance);
    };
    test_scenario::end(scenario);
}

#[test]
fun should_allow_any_sender_to_create_admin_cap() {
    let mut scenario = test_scenario::begin(BOB);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let mut instance = challenge_05::new_instance_for_testing(ALICE, ctx);

        challenge_05::vulnerable_create_admin_cap(&mut instance, ctx);
        assert!(challenge_05::admin_cap_created(&instance));

        challenge_05::destroy_instance_for_testing(instance);
    };

    test_scenario::next_tx(&mut scenario, BOB);
    {
        let cap: challenge_05::AdminCap = test_scenario::take_from_sender(&scenario);
        assert!(challenge_05::cap_owner(&cap) == BOB);
        challenge_05::destroy_cap_for_testing(cap);
    };
    test_scenario::end(scenario);
}

#[test]
fun should_allow_cap_holder_to_set_initialized() {
    let mut scenario = test_scenario::begin(BOB);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let mut instance = challenge_05::new_instance_for_testing(ALICE, ctx);
        let cap = challenge_05::new_cap_for_testing(challenge_05::instance_id(&instance), BOB, ctx);

        challenge_05::admin_set_initialized(&mut instance, &cap);
        assert!(challenge_05::initialized(&instance));

        challenge_05::destroy_cap_for_testing(cap);
        challenge_05::destroy_instance_for_testing(instance);
    };
    test_scenario::end(scenario);
}

#[test, expected_failure(abort_code = ::suisec_dojo::challenge_05_bad_init::EInvalidCap)]
fun should_reject_cap_for_another_instance() {
    let mut scenario = test_scenario::begin(BOB);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let mut instance = challenge_05::new_instance_for_testing(ALICE, ctx);
        let other = challenge_05::new_instance_for_testing(BOB, ctx);
        let cap = challenge_05::new_cap_for_testing(challenge_05::instance_id(&other), BOB, ctx);

        challenge_05::admin_set_initialized(&mut instance, &cap);

        challenge_05::destroy_cap_for_testing(cap);
        challenge_05::destroy_instance_for_testing(other);
        challenge_05::destroy_instance_for_testing(instance);
    };
    test_scenario::end(scenario);
}

#[test]
fun should_solve_after_initialization_and_record_badge() {
    let mut scenario = test_scenario::begin(ALICE);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let mut instance = challenge_05::new_instance_for_testing(ALICE, ctx);
        let mut progress = user_progress::new_for_owner(ALICE, ctx);
        let cap = challenge_05::new_cap_for_testing(challenge_05::instance_id(&instance), ALICE, ctx);

        challenge_05::admin_set_initialized(&mut instance, &cap);
        challenge_05::solve(&mut instance, &mut progress, ctx);

        assert!(challenge_05::is_solved(&instance));
        assert!(user_progress::has_completed(&progress, 5));
        assert!(user_progress::has_badge(&progress, 3));

        challenge_05::destroy_cap_for_testing(cap);
        challenge_05::destroy_instance_for_testing(instance);
        user_progress::destroy_for_testing(progress);
    };
    test_scenario::end(scenario);
}

#[test, expected_failure(abort_code = ::suisec_dojo::challenge_05_bad_init::EInvalidSolution)]
fun should_reject_solve_before_initialized() {
    let mut scenario = test_scenario::begin(ALICE);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let mut instance = challenge_05::new_instance_for_testing(ALICE, ctx);
        let mut progress = user_progress::new_for_owner(ALICE, ctx);

        challenge_05::solve(&mut instance, &mut progress, ctx);

        challenge_05::destroy_instance_for_testing(instance);
        user_progress::destroy_for_testing(progress);
    };
    test_scenario::end(scenario);
}

#[test, expected_failure(abort_code = ::suisec_dojo::challenge_05_bad_init::ENotOwner)]
fun should_reject_non_owner_solve_attempt() {
    let mut scenario = test_scenario::begin(BOB);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let mut instance = challenge_05::new_instance_for_testing(ALICE, ctx);
        let mut progress = user_progress::new_for_owner(ALICE, ctx);
        let cap = challenge_05::new_cap_for_testing(challenge_05::instance_id(&instance), BOB, ctx);

        challenge_05::admin_set_initialized(&mut instance, &cap);
        challenge_05::solve(&mut instance, &mut progress, ctx);

        challenge_05::destroy_cap_for_testing(cap);
        challenge_05::destroy_instance_for_testing(instance);
        user_progress::destroy_for_testing(progress);
    };
    test_scenario::end(scenario);
}

#[test, expected_failure(abort_code = ::suisec_dojo::challenge_05_bad_init::EAlreadySolved)]
fun should_reject_duplicate_solve() {
    let mut scenario = test_scenario::begin(ALICE);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let mut instance = challenge_05::new_instance_for_testing(ALICE, ctx);
        let mut progress = user_progress::new_for_owner(ALICE, ctx);
        let cap = challenge_05::new_cap_for_testing(challenge_05::instance_id(&instance), ALICE, ctx);

        challenge_05::admin_set_initialized(&mut instance, &cap);
        challenge_05::solve(&mut instance, &mut progress, ctx);
        challenge_05::solve(&mut instance, &mut progress, ctx);

        challenge_05::destroy_cap_for_testing(cap);
        challenge_05::destroy_instance_for_testing(instance);
        user_progress::destroy_for_testing(progress);
    };
    test_scenario::end(scenario);
}

