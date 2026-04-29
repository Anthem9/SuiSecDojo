#[test_only]
module suisec_dojo::challenge_01_tests;

use sui::test_scenario;
use suisec_dojo::challenge_01_anyone_can_mint as challenge_01;
use suisec_dojo::user_progress::{Self, UserProgress};

const ALICE: address = @0xA11CE;
const BOB: address = @0xB0B;

#[test]
fun should_create_user_owned_instance_and_progress() {
    let mut scenario = test_scenario::begin(ALICE);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let instance = challenge_01::new_instance(ALICE, ctx);
        let progress = user_progress::new_for_owner(ALICE, ctx);

        assert!(challenge_01::challenge_id(&instance) == 1);
        assert!(challenge_01::owner(&instance) == ALICE);
        assert!(challenge_01::minted_amount(&instance) == 0);
        assert!(!challenge_01::is_solved(&instance));
        assert!(user_progress::owner(&progress) == ALICE);
        assert!(user_progress::claimed_count(&progress) == 0);

        challenge_01::destroy_for_testing(instance);
        user_progress::destroy_for_testing(progress);
    };
    test_scenario::end(scenario);
}

#[test]
fun should_create_progress_entry_for_sender() {
    let mut scenario = test_scenario::begin(ALICE);
    {
        user_progress::create(test_scenario::ctx(&mut scenario));
    };

    test_scenario::next_tx(&mut scenario, ALICE);
    {
        let progress: UserProgress = test_scenario::take_from_sender(&scenario);

        assert!(user_progress::owner(&progress) == ALICE);
        assert!(user_progress::claimed_count(&progress) == 0);
        assert!(user_progress::completed_count(&progress) == 0);

        user_progress::destroy_for_testing(progress);
    };
    test_scenario::end(scenario);
}

#[test]
fun should_claim_challenge_instance_for_sender() {
    let mut scenario = test_scenario::begin(ALICE);
    {
        user_progress::create(test_scenario::ctx(&mut scenario));
    };

    test_scenario::next_tx(&mut scenario, ALICE);
    {
        let mut progress: UserProgress = test_scenario::take_from_sender(&scenario);

        challenge_01::claim(&mut progress, test_scenario::ctx(&mut scenario));
        assert!(user_progress::has_claimed(&progress, 1));

        test_scenario::return_to_sender(&scenario, progress);
    };

    test_scenario::next_tx(&mut scenario, ALICE);
    {
        let progress: UserProgress = test_scenario::take_from_sender(&scenario);
        let instance: challenge_01::ChallengeInstance = test_scenario::take_from_sender(&scenario);

        assert!(user_progress::has_claimed(&progress, 1));
        assert!(challenge_01::owner(&instance) == ALICE);
        assert!(challenge_01::challenge_id(&instance) == 1);

        user_progress::destroy_for_testing(progress);
        challenge_01::destroy_for_testing(instance);
    };
    test_scenario::end(scenario);
}

#[test, expected_failure(abort_code = ::suisec_dojo::user_progress::EAlreadyClaimed)]
fun should_reject_duplicate_claim_on_same_progress() {
    let mut scenario = test_scenario::begin(ALICE);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let mut progress = user_progress::new_for_owner(ALICE, ctx);

        challenge_01::claim(&mut progress, ctx);
        challenge_01::claim(&mut progress, ctx);

        user_progress::destroy_for_testing(progress);
    };
    test_scenario::end(scenario);
}

#[test]
fun should_solve_after_user_exploits_unrestricted_mint() {
    let mut scenario = test_scenario::begin(ALICE);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let mut instance = challenge_01::new_instance(ALICE, ctx);
        let mut progress = user_progress::new_for_owner(ALICE, ctx);

        challenge_01::vulnerable_mint(&mut instance, challenge_01::solve_threshold_for_testing());
        challenge_01::solve(&mut instance, &mut progress, 1, 0, ctx);

        assert!(challenge_01::is_solved(&instance));
        assert!(user_progress::has_completed(&progress, 1));
        assert!(user_progress::completed_count(&progress) == 1);

        challenge_01::destroy_for_testing(instance);
        user_progress::destroy_for_testing(progress);
    };
    test_scenario::end(scenario);
}

#[test, expected_failure(abort_code = ::suisec_dojo::challenge_01_anyone_can_mint::EAlreadySolved)]
fun should_reject_duplicate_solve() {
    let mut scenario = test_scenario::begin(ALICE);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let mut instance = challenge_01::new_instance(ALICE, ctx);
        let mut progress = user_progress::new_for_owner(ALICE, ctx);

        challenge_01::vulnerable_mint(&mut instance, challenge_01::solve_threshold_for_testing());
        challenge_01::solve(&mut instance, &mut progress, 1, 0, ctx);
        challenge_01::solve(&mut instance, &mut progress, 1, 0, ctx);

        challenge_01::destroy_for_testing(instance);
        user_progress::destroy_for_testing(progress);
    };
    test_scenario::end(scenario);
}

#[test, expected_failure(abort_code = ::suisec_dojo::challenge_01_anyone_can_mint::EInvalidSolution)]
fun should_reject_solve_before_threshold_is_reached() {
    let mut scenario = test_scenario::begin(ALICE);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let mut instance = challenge_01::new_instance(ALICE, ctx);
        let mut progress = user_progress::new_for_owner(ALICE, ctx);

        challenge_01::vulnerable_mint(&mut instance, 999);
        challenge_01::solve(&mut instance, &mut progress, 1, 0, ctx);

        challenge_01::destroy_for_testing(instance);
        user_progress::destroy_for_testing(progress);
    };
    test_scenario::end(scenario);
}

#[test, expected_failure(abort_code = ::suisec_dojo::challenge_01_anyone_can_mint::ENotOwner)]
fun should_reject_non_owner_solve_attempt() {
    let mut scenario = test_scenario::begin(BOB);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let mut instance = challenge_01::new_instance(ALICE, ctx);
        let mut progress = user_progress::new_for_owner(ALICE, ctx);

        challenge_01::vulnerable_mint(&mut instance, challenge_01::solve_threshold_for_testing());
        challenge_01::solve(&mut instance, &mut progress, 1, 0, ctx);

        challenge_01::destroy_for_testing(instance);
        user_progress::destroy_for_testing(progress);
    };
    test_scenario::end(scenario);
}
