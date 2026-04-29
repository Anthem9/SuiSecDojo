#[test_only]
module suisec_dojo::challenge_07_10_tests;

use sui::test_scenario;
use suisec_dojo::challenge_07_overflow_guard as c7;
use suisec_dojo::challenge_08_old_package_trap as c8;
use suisec_dojo::challenge_09_ptb_combo as c9;
use suisec_dojo::challenge_10_mini_amm_incident as c10;
use suisec_dojo::user_progress;

const ALICE: address = @0xA11CE;
const BOB: address = @0xB0B;

#[test]
fun should_solve_challenge_07_after_wrong_guard_bypass() {
    let mut scenario = test_scenario::begin(ALICE);
    let ctx = test_scenario::ctx(&mut scenario);
    let mut progress = user_progress::new_for_owner(ALICE, ctx);
    let mut instance = c7::new_instance_for_testing(ALICE, ctx);

    c7::vulnerable_set_value(&mut instance, 1_000);
    c7::solve(&mut instance, &mut progress, 1, 0, ctx);

    assert!(c7::is_solved(&instance));
    assert!(user_progress::has_completed(&progress, 7));
    c7::destroy_for_testing(instance);
    user_progress::destroy_for_testing(progress);
    test_scenario::end(scenario);
}

#[test, expected_failure(abort_code = ::suisec_dojo::challenge_07_overflow_guard::EInvalidSolution)]
fun should_reject_challenge_07_before_bypass() {
    let mut scenario = test_scenario::begin(ALICE);
    let ctx = test_scenario::ctx(&mut scenario);
    let mut progress = user_progress::new_for_owner(ALICE, ctx);
    let mut instance = c7::new_instance_for_testing(ALICE, ctx);
    c7::solve(&mut instance, &mut progress, 1, 0, ctx);
    c7::destroy_for_testing(instance);
    user_progress::destroy_for_testing(progress);
    test_scenario::end(scenario);
}

#[test]
fun should_solve_challenge_08_through_old_path() {
    let mut scenario = test_scenario::begin(ALICE);
    let ctx = test_scenario::ctx(&mut scenario);
    let mut progress = user_progress::new_for_owner(ALICE, ctx);
    let mut instance = c8::new_instance_for_testing(ALICE, ctx);

    c8::old_vulnerable_path(&mut instance);
    c8::solve(&mut instance, &mut progress, 1, 0, ctx);

    assert!(c8::legacy_flag(&instance));
    assert!(c8::is_solved(&instance));
    assert!(user_progress::has_completed(&progress, 8));
    c8::destroy_for_testing(instance);
    user_progress::destroy_for_testing(progress);
    test_scenario::end(scenario);
}

#[test, expected_failure(abort_code = ::suisec_dojo::challenge_08_old_package_trap::ENewPathRejected)]
fun should_show_challenge_08_new_path_rejects() {
    let mut scenario = test_scenario::begin(ALICE);
    let ctx = test_scenario::ctx(&mut scenario);
    let mut instance = c8::new_instance_for_testing(ALICE, ctx);
    c8::new_checked_path(&mut instance);
    c8::destroy_for_testing(instance);
    test_scenario::end(scenario);
}

#[test]
fun should_solve_challenge_09_with_ptb_combo_token() {
    let mut scenario = test_scenario::begin(ALICE);
    let ctx = test_scenario::ctx(&mut scenario);
    let mut progress = user_progress::new_for_owner(ALICE, ctx);
    let mut instance = c9::new_instance_for_testing(ALICE, ctx);

    c9::prepare_combo(&mut instance);
    c9::finish_combo(&mut instance);
    c9::solve(&mut instance, &mut progress, 1, 0, ctx);

    assert!(c9::combo_ready(&instance));
    assert!(c9::is_solved(&instance));
    assert!(user_progress::has_completed(&progress, 9));
    c9::destroy_for_testing(instance);
    user_progress::destroy_for_testing(progress);
    test_scenario::end(scenario);
}

#[test, expected_failure(abort_code = ::suisec_dojo::challenge_09_ptb_combo::EInvalidSolution)]
fun should_reject_challenge_09_before_combo() {
    let mut scenario = test_scenario::begin(ALICE);
    let ctx = test_scenario::ctx(&mut scenario);
    let mut progress = user_progress::new_for_owner(ALICE, ctx);
    let mut instance = c9::new_instance_for_testing(ALICE, ctx);
    c9::solve(&mut instance, &mut progress, 1, 0, ctx);
    c9::destroy_for_testing(instance);
    user_progress::destroy_for_testing(progress);
    test_scenario::end(scenario);
}

#[test]
fun should_solve_challenge_10_after_amm_invariant_break() {
    let mut scenario = test_scenario::begin(ALICE);
    let ctx = test_scenario::ctx(&mut scenario);
    let mut progress = user_progress::new_for_owner(ALICE, ctx);
    let mut instance = c10::new_instance_for_testing(ALICE, ctx);

    c10::vulnerable_swap(&mut instance, 100);
    c10::solve(&mut instance, &mut progress, 1, 0, ctx);

    assert!(c10::invariant_broken(&instance));
    assert!(c10::attacker_profit(&instance) >= 100);
    assert!(c10::is_solved(&instance));
    assert!(user_progress::has_completed(&progress, 10));
    c10::destroy_for_testing(instance);
    user_progress::destroy_for_testing(progress);
    test_scenario::end(scenario);
}

#[test, expected_failure(abort_code = ::suisec_dojo::challenge_10_mini_amm_incident::EInvalidSolution)]
fun should_reject_challenge_10_before_invariant_break() {
    let mut scenario = test_scenario::begin(ALICE);
    let ctx = test_scenario::ctx(&mut scenario);
    let mut progress = user_progress::new_for_owner(ALICE, ctx);
    let mut instance = c10::new_instance_for_testing(ALICE, ctx);
    c10::solve(&mut instance, &mut progress, 1, 0, ctx);
    c10::destroy_for_testing(instance);
    user_progress::destroy_for_testing(progress);
    test_scenario::end(scenario);
}

#[test, expected_failure(abort_code = ::suisec_dojo::challenge_10_mini_amm_incident::ENotOwner)]
fun should_reject_non_owner_challenge_10_solve() {
    let mut scenario = test_scenario::begin(BOB);
    let ctx = test_scenario::ctx(&mut scenario);
    let mut progress = user_progress::new_for_owner(ALICE, ctx);
    let mut instance = c10::new_instance_for_testing(ALICE, ctx);
    c10::vulnerable_swap(&mut instance, 100);
    c10::solve(&mut instance, &mut progress, 1, 0, ctx);
    c10::destroy_for_testing(instance);
    user_progress::destroy_for_testing(progress);
    test_scenario::end(scenario);
}
