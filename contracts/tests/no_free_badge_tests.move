#[test_only]
module suisec_dojo::no_free_badge_tests;

use sui::event;
use sui::test_scenario;
use suisec_dojo::challenge_01_anyone_can_mint as challenge_01;
use suisec_dojo::challenge_02_shared_vault as challenge_02;
use suisec_dojo::challenge_03_fake_owner as challenge_03;
use suisec_dojo::challenge_04_leaky_capability as challenge_04;
use suisec_dojo::challenge_06_price_rounding as challenge_06;
use suisec_dojo::challenge_10_mini_amm_incident as challenge_10;
use suisec_dojo::challenge_events::{Self, ChallengeCompleted};
use suisec_dojo::user_progress;

const ALICE: address = @0xA11CE;

#[test]
fun challenge_01_solve_should_not_record_free_badge() {
    let mut scenario = test_scenario::begin(ALICE);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let mut instance = challenge_01::new_instance(ALICE, ctx);
        let mut progress = user_progress::new_for_owner(ALICE, ctx);

        challenge_01::vulnerable_mint(&mut instance, challenge_01::solve_threshold_for_testing());
        challenge_01::solve(&mut instance, &mut progress, 1, 0, ctx);

        assert!(!user_progress::has_badge(&progress, 1));
        assert_latest_event(1, ALICE);

        challenge_01::destroy_for_testing(instance);
        user_progress::destroy_for_testing(progress);
    };
    test_scenario::end(scenario);
}

#[test]
fun challenge_02_solve_should_not_record_free_badge() {
    let mut scenario = test_scenario::begin(ALICE);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let mut vault = challenge_02::new_vault_for_testing(ALICE, ctx);
        let mut instance = challenge_02::new_instance_for_testing(ALICE, challenge_02::vault_object_id(&vault), ctx);
        let mut progress = user_progress::new_for_owner(ALICE, ctx);

        challenge_02::vulnerable_withdraw(&mut vault, challenge_02::initial_vault_balance_for_testing());
        challenge_02::solve(&mut instance, &vault, &mut progress, 1, 0, ctx);

        assert!(!user_progress::has_badge(&progress, 2));
        assert_latest_event(2, ALICE);

        challenge_02::destroy_vault_for_testing(vault);
        challenge_02::destroy_instance_for_testing(instance);
        user_progress::destroy_for_testing(progress);
    };
    test_scenario::end(scenario);
}

#[test]
fun challenge_03_solve_should_not_record_free_badge() {
    let mut scenario = test_scenario::begin(ALICE);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let mut instance = challenge_03::new_instance_for_testing(ALICE, ctx);
        let mut progress = user_progress::new_for_owner(ALICE, ctx);

        challenge_03::vulnerable_set_flag(&mut instance, ALICE, true);
        challenge_03::solve(&mut instance, &mut progress, 1, 0, ctx);

        assert!(!user_progress::has_badge(&progress, 3));
        assert_latest_event(3, ALICE);

        challenge_03::destroy_for_testing(instance);
        user_progress::destroy_for_testing(progress);
    };
    test_scenario::end(scenario);
}

#[test]
fun challenge_04_solve_should_not_record_free_badge() {
    let mut scenario = test_scenario::begin(ALICE);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let mut instance = challenge_04::new_instance_for_testing(ALICE, ctx);
        let mut progress = user_progress::new_for_owner(ALICE, ctx);
        let cap = challenge_04::new_cap_for_testing(challenge_04::instance_id(&instance), ALICE, ctx);

        challenge_04::admin_set_flag(&mut instance, &cap);
        challenge_04::solve(&mut instance, &mut progress, 1, 0, ctx);

        assert!(!user_progress::has_badge(&progress, 3));
        assert_latest_event(4, ALICE);

        challenge_04::destroy_cap_for_testing(cap);
        challenge_04::destroy_instance_for_testing(instance);
        user_progress::destroy_for_testing(progress);
    };
    test_scenario::end(scenario);
}

#[test]
fun defi_solves_should_not_record_free_badge() {
    let mut scenario = test_scenario::begin(ALICE);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let mut challenge_06_instance = challenge_06::new_instance_for_testing(ALICE, ctx);
        let mut challenge_10_instance = challenge_10::new_instance_for_testing(ALICE, ctx);
        let mut progress = user_progress::new_for_owner(ALICE, ctx);

        let mut i = 0u64;
        while (i < challenge_06::solve_credits_for_testing()) {
            challenge_06::vulnerable_buy(&mut challenge_06_instance, 1);
            i = i + 1;
        };
        challenge_06::solve(&mut challenge_06_instance, &mut progress, 1, 0, ctx);
        challenge_10::vulnerable_swap(&mut challenge_10_instance, 100);
        challenge_10::solve(&mut challenge_10_instance, &mut progress, 1, 0, ctx);

        assert!(!user_progress::has_badge(&progress, 4));
        assert_latest_event(10, ALICE);

        challenge_06::destroy_for_testing(challenge_06_instance);
        challenge_10::destroy_for_testing(challenge_10_instance);
        user_progress::destroy_for_testing(progress);
    };
    test_scenario::end(scenario);
}

fun assert_latest_event(challenge_id: u64, solver: address) {
    let events = event::events_by_type<ChallengeCompleted>();
    let latest = vector::borrow(&events, (event::num_events() as u64) - 1);
    assert!(challenge_events::challenge_id(latest) == challenge_id);
    assert!(challenge_events::solver(latest) == solver);
    assert!(challenge_events::badge_type(latest) == 0);
    assert!(challenge_events::mode(latest) == 1);
    assert!(challenge_events::assistance_level(latest) == 0);
    assert!(challenge_events::score(latest) > 0);
}
