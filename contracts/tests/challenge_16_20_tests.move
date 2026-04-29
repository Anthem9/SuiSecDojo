#[test_only]
module suisec_dojo::challenge_16_20_tests;

use sui::test_scenario;
use suisec_dojo::challenge_16_signer_confusion as c16;
use suisec_dojo::challenge_17_dynamic_field_shadow as c17;
use suisec_dojo::challenge_18_epoch_reward_drift as c18;
use suisec_dojo::challenge_19_upgrade_witness_gap as c19;
use suisec_dojo::challenge_20_liquidation_edge_case as c20;
use suisec_dojo::user_progress;

const ALICE: address = @0xA11CE;
const BOB: address = @0xB0B;

#[test]
fun should_solve_challenge_16_after_claimed_signer_matches_owner() {
    let mut scenario = test_scenario::begin(ALICE);
    let ctx = test_scenario::ctx(&mut scenario);
    let mut progress = user_progress::new_for_owner(ALICE, ctx);
    let mut instance = c16::new_instance_for_testing(ALICE, ctx);

    c16::vulnerable_accept_intent(&mut instance, ALICE);
    c16::solve(&mut instance, &mut progress, 1, 0, ctx);

    assert!(c16::intent_accepted(&instance));
    assert!(c16::trusted_signer(&instance) == ALICE);
    assert!(c16::is_solved(&instance));
    assert!(user_progress::has_completed(&progress, 16));
    c16::destroy_for_testing(instance);
    user_progress::destroy_for_testing(progress);
    test_scenario::end(scenario);
}

#[test, expected_failure(abort_code = ::suisec_dojo::challenge_16_signer_confusion::EInvalidSolution)]
fun should_reject_challenge_16_wrong_claimed_signer() {
    let mut scenario = test_scenario::begin(ALICE);
    let ctx = test_scenario::ctx(&mut scenario);
    let mut progress = user_progress::new_for_owner(ALICE, ctx);
    let mut instance = c16::new_instance_for_testing(ALICE, ctx);
    c16::vulnerable_accept_intent(&mut instance, BOB);
    c16::solve(&mut instance, &mut progress, 1, 0, ctx);
    c16::destroy_for_testing(instance);
    user_progress::destroy_for_testing(progress);
    test_scenario::end(scenario);
}

#[test]
fun should_solve_challenge_17_after_shadowing_expected_key() {
    let mut scenario = test_scenario::begin(ALICE);
    let ctx = test_scenario::ctx(&mut scenario);
    let mut progress = user_progress::new_for_owner(ALICE, ctx);
    let mut instance = c17::new_instance_for_testing(ALICE, ctx);

    c17::vulnerable_write_shadow(&mut instance, 7);
    c17::solve(&mut instance, &mut progress, 1, 0, ctx);

    assert!(c17::shadow_written(&instance));
    assert!(c17::shadow_key(&instance) == 7);
    assert!(user_progress::has_completed(&progress, 17));
    c17::destroy_for_testing(instance);
    user_progress::destroy_for_testing(progress);
    test_scenario::end(scenario);
}

#[test, expected_failure(abort_code = ::suisec_dojo::challenge_17_dynamic_field_shadow::EInvalidSolution)]
fun should_reject_challenge_17_wrong_shadow_key() {
    let mut scenario = test_scenario::begin(ALICE);
    let ctx = test_scenario::ctx(&mut scenario);
    let mut progress = user_progress::new_for_owner(ALICE, ctx);
    let mut instance = c17::new_instance_for_testing(ALICE, ctx);
    c17::vulnerable_write_shadow(&mut instance, 8);
    c17::solve(&mut instance, &mut progress, 1, 0, ctx);
    c17::destroy_for_testing(instance);
    user_progress::destroy_for_testing(progress);
    test_scenario::end(scenario);
}

#[test]
fun should_solve_challenge_18_after_reward_drift() {
    let mut scenario = test_scenario::begin(ALICE);
    let ctx = test_scenario::ctx(&mut scenario);
    let mut progress = user_progress::new_for_owner(ALICE, ctx);
    let mut instance = c18::new_instance_for_testing(ALICE, ctx);

    c18::vulnerable_accrue(&mut instance, 4, 6);
    c18::solve(&mut instance, &mut progress, 1, 0, ctx);

    assert!(c18::rewards(&instance) == 24);
    assert!(c18::last_epoch(&instance) == 0);
    assert!(user_progress::has_completed(&progress, 18));
    c18::destroy_for_testing(instance);
    user_progress::destroy_for_testing(progress);
    test_scenario::end(scenario);
}

#[test, expected_failure(abort_code = ::suisec_dojo::challenge_18_epoch_reward_drift::EInvalidInput)]
fun should_reject_challenge_18_zero_repeats() {
    let mut scenario = test_scenario::begin(ALICE);
    let ctx = test_scenario::ctx(&mut scenario);
    let mut instance = c18::new_instance_for_testing(ALICE, ctx);
    c18::vulnerable_accrue(&mut instance, 4, 0);
    c18::destroy_for_testing(instance);
    test_scenario::end(scenario);
}

#[test]
fun should_solve_challenge_19_with_old_witness() {
    let mut scenario = test_scenario::begin(ALICE);
    let ctx = test_scenario::ctx(&mut scenario);
    let mut progress = user_progress::new_for_owner(ALICE, ctx);
    let mut instance = c19::new_instance_for_testing(ALICE, ctx);
    let witness = c19::new_old_witness_for_testing(&instance, ctx);

    c19::old_admin_path(&mut instance, &witness);
    c19::solve(&mut instance, &mut progress, 1, 0, ctx);

    assert!(c19::old_witness_used(&instance));
    assert!(user_progress::has_completed(&progress, 19));
    c19::destroy_witness_for_testing(witness);
    c19::destroy_for_testing(instance);
    user_progress::destroy_for_testing(progress);
    test_scenario::end(scenario);
}

#[test, expected_failure(abort_code = ::suisec_dojo::challenge_19_upgrade_witness_gap::EWrongWitness)]
fun should_reject_challenge_19_wrong_witness_scope() {
    let mut scenario = test_scenario::begin(ALICE);
    let ctx = test_scenario::ctx(&mut scenario);
    let mut instance = c19::new_instance_for_testing(ALICE, ctx);
    let other = c19::new_instance_for_testing(ALICE, ctx);
    let witness = c19::new_old_witness_for_testing(&other, ctx);
    c19::old_admin_path(&mut instance, &witness);
    c19::destroy_witness_for_testing(witness);
    c19::destroy_for_testing(other);
    c19::destroy_for_testing(instance);
    test_scenario::end(scenario);
}

#[test]
fun should_solve_challenge_20_after_edge_liquidation() {
    let mut scenario = test_scenario::begin(ALICE);
    let ctx = test_scenario::ctx(&mut scenario);
    let mut progress = user_progress::new_for_owner(ALICE, ctx);
    let mut instance = c20::new_instance_for_testing(ALICE, ctx);

    c20::vulnerable_liquidate(&mut instance, 24, 50);
    c20::solve(&mut instance, &mut progress, 1, 0, ctx);

    assert!(c20::liquidated(&instance));
    assert!(c20::health(&instance) == 48);
    assert!(user_progress::has_completed(&progress, 20));
    c20::destroy_for_testing(instance);
    user_progress::destroy_for_testing(progress);
    test_scenario::end(scenario);
}

#[test, expected_failure(abort_code = ::suisec_dojo::challenge_20_liquidation_edge_case::EInvalidSolution)]
fun should_reject_challenge_20_at_exact_threshold() {
    let mut scenario = test_scenario::begin(ALICE);
    let ctx = test_scenario::ctx(&mut scenario);
    let mut progress = user_progress::new_for_owner(ALICE, ctx);
    let mut instance = c20::new_instance_for_testing(ALICE, ctx);
    c20::vulnerable_liquidate(&mut instance, 25, 50);
    c20::solve(&mut instance, &mut progress, 1, 0, ctx);
    c20::destroy_for_testing(instance);
    user_progress::destroy_for_testing(progress);
    test_scenario::end(scenario);
}

#[test, expected_failure(abort_code = ::suisec_dojo::challenge_20_liquidation_edge_case::ENotOwner)]
fun should_reject_non_owner_challenge_20_solve() {
    let mut scenario = test_scenario::begin(BOB);
    let ctx = test_scenario::ctx(&mut scenario);
    let mut progress = user_progress::new_for_owner(ALICE, ctx);
    let mut instance = c20::new_instance_for_testing(ALICE, ctx);
    c20::vulnerable_liquidate(&mut instance, 24, 50);
    c20::solve(&mut instance, &mut progress, 1, 0, ctx);
    c20::destroy_for_testing(instance);
    user_progress::destroy_for_testing(progress);
    test_scenario::end(scenario);
}
