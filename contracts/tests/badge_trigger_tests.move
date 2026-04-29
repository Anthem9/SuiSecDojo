#[test_only]
module suisec_dojo::badge_trigger_tests;

use sui::test_scenario;
use sui::event;
use suisec_dojo::badge::{Self, Badge};
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
fun should_record_object_security_badge_after_challenge_01() {
    let mut scenario = test_scenario::begin(ALICE);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let mut instance = challenge_01::new_instance(ALICE, ctx);
        let mut progress = user_progress::new_for_owner(ALICE, ctx);

        challenge_01::vulnerable_mint(&mut instance, challenge_01::solve_threshold_for_testing());
        challenge_01::solve(&mut instance, &mut progress, ctx);

        assert!(user_progress::has_badge(&progress, 1));
        assert_latest_event(1, ALICE, 1);

        challenge_01::destroy_for_testing(instance);
        user_progress::destroy_for_testing(progress);
    };
    test_scenario::next_tx(&mut scenario, ALICE);
    {
        let badge: Badge = test_scenario::take_from_sender(&scenario);
        assert!(badge::owner(&badge) == ALICE);
        assert!(badge::badge_type(&badge) == 1);
        badge::destroy_for_testing(badge);
    };
    test_scenario::end(scenario);
}

#[test]
fun should_record_shared_object_badge_after_challenge_02() {
    let mut scenario = test_scenario::begin(ALICE);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let mut vault = challenge_02::new_vault_for_testing(ALICE, ctx);
        let mut instance = challenge_02::new_instance_for_testing(ALICE, challenge_02::vault_object_id(&vault), ctx);
        let mut progress = user_progress::new_for_owner(ALICE, ctx);

        challenge_02::vulnerable_withdraw(&mut vault, challenge_02::initial_vault_balance_for_testing());
        challenge_02::solve(&mut instance, &vault, &mut progress, ctx);

        assert!(user_progress::has_badge(&progress, 2));
        assert_latest_event(2, ALICE, 2);

        challenge_02::destroy_vault_for_testing(vault);
        challenge_02::destroy_instance_for_testing(instance);
        user_progress::destroy_for_testing(progress);
    };
    test_scenario::next_tx(&mut scenario, ALICE);
    {
        let badge: Badge = test_scenario::take_from_sender(&scenario);
        assert!(badge::owner(&badge) == ALICE);
        assert!(badge::badge_type(&badge) == 2);
        badge::destroy_for_testing(badge);
    };
    test_scenario::end(scenario);
}

#[test]
fun should_record_authorization_badge_after_challenge_03() {
    let mut scenario = test_scenario::begin(ALICE);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let mut instance = challenge_03::new_instance_for_testing(ALICE, ctx);
        let mut progress = user_progress::new_for_owner(ALICE, ctx);

        challenge_03::vulnerable_set_flag(&mut instance, ALICE, true);
        challenge_03::solve(&mut instance, &mut progress, ctx);

        assert!(user_progress::has_badge(&progress, 3));
        assert_latest_event(3, ALICE, 3);

        challenge_03::destroy_for_testing(instance);
        user_progress::destroy_for_testing(progress);
    };
    test_scenario::next_tx(&mut scenario, ALICE);
    {
        let badge: Badge = test_scenario::take_from_sender(&scenario);
        assert!(badge::owner(&badge) == ALICE);
        assert!(badge::badge_type(&badge) == 3);
        badge::destroy_for_testing(badge);
    };
    test_scenario::end(scenario);
}

#[test]
fun should_record_capability_badge_after_challenge_04() {
    let mut scenario = test_scenario::begin(ALICE);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let mut instance = challenge_04::new_instance_for_testing(ALICE, ctx);
        let mut progress = user_progress::new_for_owner(ALICE, ctx);
        let cap = challenge_04::new_cap_for_testing(challenge_04::instance_id(&instance), ALICE, ctx);

        challenge_04::admin_set_flag(&mut instance, &cap);
        challenge_04::solve(&mut instance, &mut progress, ctx);

        assert!(user_progress::has_badge(&progress, 3));
        assert_latest_event(4, ALICE, 3);

        challenge_04::destroy_cap_for_testing(cap);
        challenge_04::destroy_instance_for_testing(instance);
        user_progress::destroy_for_testing(progress);
    };
    test_scenario::next_tx(&mut scenario, ALICE);
    {
        let badge: Badge = test_scenario::take_from_sender(&scenario);
        assert!(badge::owner(&badge) == ALICE);
        assert!(badge::badge_type(&badge) == 3);
        badge::destroy_for_testing(badge);
    };
    test_scenario::end(scenario);
}

#[test]
fun should_record_defi_badge_after_challenges_06_and_10() {
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
        challenge_06::solve(&mut challenge_06_instance, &mut progress, ctx);
        assert!(!user_progress::has_badge(&progress, 4));

        challenge_10::vulnerable_swap(&mut challenge_10_instance, 100);
        challenge_10::solve(&mut challenge_10_instance, &mut progress, ctx);
        assert!(user_progress::has_badge(&progress, 4));
        assert_latest_event(10, ALICE, 4);

        challenge_06::destroy_for_testing(challenge_06_instance);
        challenge_10::destroy_for_testing(challenge_10_instance);
        user_progress::destroy_for_testing(progress);
    };
    test_scenario::next_tx(&mut scenario, ALICE);
    {
        let badge: Badge = test_scenario::take_from_sender(&scenario);
        assert!(badge::owner(&badge) == ALICE);
        assert!(badge::badge_type(&badge) == 4);
        badge::destroy_for_testing(badge);
    };
    test_scenario::end(scenario);
}

fun assert_latest_event(challenge_id: u64, solver: address, badge_type: u64) {
    let events = event::events_by_type<ChallengeCompleted>();
    let latest = vector::borrow(&events, (event::num_events() as u64) - 1);
    assert!(challenge_events::challenge_id(latest) == challenge_id);
    assert!(challenge_events::solver(latest) == solver);
    assert!(challenge_events::badge_type(latest) == badge_type);
}
