#[test_only]
module suisec_dojo::challenge_03_tests;

use sui::test_scenario;
use suisec_dojo::challenge_03_fake_owner as challenge_03;
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
        challenge_03::claim(&mut progress, test_scenario::ctx(&mut scenario));
        assert!(user_progress::has_claimed(&progress, 3));
        test_scenario::return_to_sender(&scenario, progress);
    };

    test_scenario::next_tx(&mut scenario, ALICE);
    {
        let progress: UserProgress = test_scenario::take_from_sender(&scenario);
        let instance: challenge_03::ChallengeInstance = test_scenario::take_from_sender(&scenario);

        assert!(challenge_03::owner(&instance) == ALICE);
        assert!(challenge_03::challenge_id(&instance) == 3);
        assert!(!challenge_03::restricted_flag(&instance));
        assert!(!challenge_03::is_solved(&instance));

        user_progress::destroy_for_testing(progress);
        challenge_03::destroy_for_testing(instance);
    };
    test_scenario::end(scenario);
}

#[test]
fun should_allow_attacker_to_set_flag_by_passing_owner_address() {
    let mut scenario = test_scenario::begin(BOB);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let mut instance = challenge_03::new_instance_for_testing(ALICE, ctx);

        challenge_03::vulnerable_set_flag(&mut instance, ALICE, true);
        assert!(challenge_03::restricted_flag(&instance));

        challenge_03::destroy_for_testing(instance);
    };
    test_scenario::end(scenario);
}

#[test, expected_failure(abort_code = ::suisec_dojo::challenge_03_fake_owner::EInvalidClaimedOwner)]
fun should_reject_wrong_claimed_owner() {
    let mut scenario = test_scenario::begin(BOB);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let mut instance = challenge_03::new_instance_for_testing(ALICE, ctx);

        challenge_03::vulnerable_set_flag(&mut instance, BOB, true);

        challenge_03::destroy_for_testing(instance);
    };
    test_scenario::end(scenario);
}

#[test]
fun should_solve_after_flag_is_set() {
    let mut scenario = test_scenario::begin(ALICE);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let mut instance = challenge_03::new_instance_for_testing(ALICE, ctx);
        let mut progress = user_progress::new_for_owner(ALICE, ctx);

        challenge_03::vulnerable_set_flag(&mut instance, ALICE, true);
        challenge_03::solve(&mut instance, &mut progress, ctx);

        assert!(challenge_03::is_solved(&instance));
        assert!(user_progress::has_completed(&progress, 3));

        challenge_03::destroy_for_testing(instance);
        user_progress::destroy_for_testing(progress);
    };
    test_scenario::end(scenario);
}

#[test, expected_failure(abort_code = ::suisec_dojo::challenge_03_fake_owner::EInvalidSolution)]
fun should_reject_solve_before_flag_is_set() {
    let mut scenario = test_scenario::begin(ALICE);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let mut instance = challenge_03::new_instance_for_testing(ALICE, ctx);
        let mut progress = user_progress::new_for_owner(ALICE, ctx);

        challenge_03::solve(&mut instance, &mut progress, ctx);

        challenge_03::destroy_for_testing(instance);
        user_progress::destroy_for_testing(progress);
    };
    test_scenario::end(scenario);
}

#[test, expected_failure(abort_code = ::suisec_dojo::challenge_03_fake_owner::ENotOwner)]
fun should_reject_non_owner_solve_attempt() {
    let mut scenario = test_scenario::begin(BOB);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let mut instance = challenge_03::new_instance_for_testing(ALICE, ctx);
        let mut progress = user_progress::new_for_owner(ALICE, ctx);

        challenge_03::vulnerable_set_flag(&mut instance, ALICE, true);
        challenge_03::solve(&mut instance, &mut progress, ctx);

        challenge_03::destroy_for_testing(instance);
        user_progress::destroy_for_testing(progress);
    };
    test_scenario::end(scenario);
}

#[test, expected_failure(abort_code = ::suisec_dojo::challenge_03_fake_owner::EAlreadySolved)]
fun should_reject_duplicate_solve() {
    let mut scenario = test_scenario::begin(ALICE);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let mut instance = challenge_03::new_instance_for_testing(ALICE, ctx);
        let mut progress = user_progress::new_for_owner(ALICE, ctx);

        challenge_03::vulnerable_set_flag(&mut instance, ALICE, true);
        challenge_03::solve(&mut instance, &mut progress, ctx);
        challenge_03::solve(&mut instance, &mut progress, ctx);

        challenge_03::destroy_for_testing(instance);
        user_progress::destroy_for_testing(progress);
    };
    test_scenario::end(scenario);
}
