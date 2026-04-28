#[test_only]
module suisec_dojo::challenge_01_tests;

use sui::test_scenario;
use suisec_dojo::challenge_01_anyone_can_mint as challenge_01;
use suisec_dojo::user_progress;

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

        challenge_01::destroy_for_testing(instance);
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
        challenge_01::solve(&mut instance, &mut progress, ctx);

        assert!(challenge_01::is_solved(&instance));
        assert!(user_progress::has_completed(&progress, 1));
        assert!(user_progress::completed_count(&progress) == 1);

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
        challenge_01::solve(&mut instance, &mut progress, ctx);

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
        challenge_01::solve(&mut instance, &mut progress, ctx);

        challenge_01::destroy_for_testing(instance);
        user_progress::destroy_for_testing(progress);
    };
    test_scenario::end(scenario);
}
