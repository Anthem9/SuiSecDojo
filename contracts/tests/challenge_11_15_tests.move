#[test_only]
module suisec_dojo::challenge_11_15_tests;

use sui::test_scenario;
use suisec_dojo::challenge_11_object_transfer_trap as c11;
use suisec_dojo::challenge_12_shared_object_pollution as c12;
use suisec_dojo::challenge_13_delegated_capability_abuse as c13;
use suisec_dojo::challenge_14_oracle_staleness as c14;
use suisec_dojo::challenge_15_coin_accounting_mismatch as c15;
use suisec_dojo::user_progress;

const ALICE: address = @0xA11CE;
const BOB: address = @0xB0B;

#[test]
fun should_solve_challenge_11_after_accepting_custody() {
    let mut scenario = test_scenario::begin(ALICE);
    let ctx = test_scenario::ctx(&mut scenario);
    let mut progress = user_progress::new_for_owner(ALICE, ctx);
    let mut instance = c11::new_instance_for_testing(ALICE, ctx);

    c11::vulnerable_accept_custody(&mut instance, ctx);
    c11::solve(&mut instance, &mut progress, 1, 0, ctx);

    assert!(c11::custodian(&instance) == ALICE);
    assert!(c11::is_solved(&instance));
    assert!(user_progress::has_completed(&progress, 11));
    c11::destroy_for_testing(instance);
    user_progress::destroy_for_testing(progress);
    test_scenario::end(scenario);
}

#[test, expected_failure(abort_code = ::suisec_dojo::challenge_11_object_transfer_trap::EInvalidSolution)]
fun should_reject_challenge_11_before_custody_change() {
    let mut scenario = test_scenario::begin(ALICE);
    let ctx = test_scenario::ctx(&mut scenario);
    let mut progress = user_progress::new_for_owner(ALICE, ctx);
    let mut instance = c11::new_instance_for_testing(ALICE, ctx);
    c11::solve(&mut instance, &mut progress, 1, 0, ctx);
    c11::destroy_for_testing(instance);
    user_progress::destroy_for_testing(progress);
    test_scenario::end(scenario);
}

#[test]
fun should_solve_challenge_12_after_pollution() {
    let mut scenario = test_scenario::begin(ALICE);
    let ctx = test_scenario::ctx(&mut scenario);
    let mut progress = user_progress::new_for_owner(ALICE, ctx);
    let mut instance = c12::new_instance_for_testing(ALICE, ctx);

    c12::vulnerable_pollute(&mut instance);
    c12::solve(&mut instance, &mut progress, 1, 0, ctx);

    assert!(c12::pollution_count(&instance) == 1);
    assert!(c12::is_solved(&instance));
    assert!(user_progress::has_completed(&progress, 12));
    c12::destroy_for_testing(instance);
    user_progress::destroy_for_testing(progress);
    test_scenario::end(scenario);
}

#[test, expected_failure(abort_code = ::suisec_dojo::challenge_12_shared_object_pollution::EInvalidSolution)]
fun should_reject_challenge_12_before_pollution() {
    let mut scenario = test_scenario::begin(ALICE);
    let ctx = test_scenario::ctx(&mut scenario);
    let mut progress = user_progress::new_for_owner(ALICE, ctx);
    let mut instance = c12::new_instance_for_testing(ALICE, ctx);
    c12::solve(&mut instance, &mut progress, 1, 0, ctx);
    c12::destroy_for_testing(instance);
    user_progress::destroy_for_testing(progress);
    test_scenario::end(scenario);
}

#[test]
fun should_solve_challenge_13_with_delegated_cap() {
    let mut scenario = test_scenario::begin(ALICE);
    let ctx = test_scenario::ctx(&mut scenario);
    let mut progress = user_progress::new_for_owner(ALICE, ctx);
    let mut instance = c13::new_instance_for_testing(ALICE, ctx);
    let cap = c13::new_cap_for_testing(&instance, ALICE, 0, ctx);

    c13::privileged_set_flag(&mut instance, &cap);
    c13::solve(&mut instance, &mut progress, 1, 0, ctx);

    assert!(c13::privileged_flag(&instance));
    assert!(c13::is_solved(&instance));
    assert!(user_progress::has_completed(&progress, 13));
    c13::destroy_cap_for_testing(cap);
    c13::destroy_for_testing(instance);
    user_progress::destroy_for_testing(progress);
    test_scenario::end(scenario);
}

#[test, expected_failure(abort_code = ::suisec_dojo::challenge_13_delegated_capability_abuse::EInvalidSolution)]
fun should_reject_challenge_13_before_flag() {
    let mut scenario = test_scenario::begin(ALICE);
    let ctx = test_scenario::ctx(&mut scenario);
    let mut progress = user_progress::new_for_owner(ALICE, ctx);
    let mut instance = c13::new_instance_for_testing(ALICE, ctx);
    c13::solve(&mut instance, &mut progress, 1, 0, ctx);
    c13::destroy_for_testing(instance);
    user_progress::destroy_for_testing(progress);
    test_scenario::end(scenario);
}

#[test]
fun should_solve_challenge_14_with_stale_price() {
    let mut scenario = test_scenario::begin(ALICE);
    let ctx = test_scenario::ctx(&mut scenario);
    let mut progress = user_progress::new_for_owner(ALICE, ctx);
    let mut instance = c14::new_instance_for_testing(ALICE, ctx);

    c14::vulnerable_use_price(&mut instance, 10, 1);
    c14::solve(&mut instance, &mut progress, 1, 0, ctx);

    assert!(c14::stale_price_used(&instance));
    assert!(c14::observed_epoch(&instance) == 1);
    assert!(c14::is_solved(&instance));
    assert!(user_progress::has_completed(&progress, 14));
    c14::destroy_for_testing(instance);
    user_progress::destroy_for_testing(progress);
    test_scenario::end(scenario);
}

#[test, expected_failure(abort_code = ::suisec_dojo::challenge_14_oracle_staleness::EInvalidSolution)]
fun should_reject_challenge_14_before_stale_price() {
    let mut scenario = test_scenario::begin(ALICE);
    let ctx = test_scenario::ctx(&mut scenario);
    let mut progress = user_progress::new_for_owner(ALICE, ctx);
    let mut instance = c14::new_instance_for_testing(ALICE, ctx);
    c14::solve(&mut instance, &mut progress, 1, 0, ctx);
    c14::destroy_for_testing(instance);
    user_progress::destroy_for_testing(progress);
    test_scenario::end(scenario);
}

#[test]
fun should_solve_challenge_15_after_accounting_mismatch() {
    let mut scenario = test_scenario::begin(ALICE);
    let ctx = test_scenario::ctx(&mut scenario);
    let mut progress = user_progress::new_for_owner(ALICE, ctx);
    let mut instance = c15::new_instance_for_testing(ALICE, ctx);

    c15::deposit(&mut instance, 10);
    c15::vulnerable_credit_without_coin(&mut instance, 1);
    c15::solve(&mut instance, &mut progress, 1, 0, ctx);

    assert!(c15::credits(&instance) > c15::deposits(&instance));
    assert!(c15::is_solved(&instance));
    assert!(user_progress::has_completed(&progress, 15));
    c15::destroy_for_testing(instance);
    user_progress::destroy_for_testing(progress);
    test_scenario::end(scenario);
}

#[test, expected_failure(abort_code = ::suisec_dojo::challenge_15_coin_accounting_mismatch::ENotOwner)]
fun should_reject_non_owner_challenge_15_solve() {
    let mut scenario = test_scenario::begin(BOB);
    let ctx = test_scenario::ctx(&mut scenario);
    let mut progress = user_progress::new_for_owner(ALICE, ctx);
    let mut instance = c15::new_instance_for_testing(ALICE, ctx);
    c15::vulnerable_credit_without_coin(&mut instance, 1);
    c15::solve(&mut instance, &mut progress, 1, 0, ctx);
    c15::destroy_for_testing(instance);
    user_progress::destroy_for_testing(progress);
    test_scenario::end(scenario);
}
