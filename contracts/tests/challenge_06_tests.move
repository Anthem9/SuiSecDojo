#[test_only]
module suisec_dojo::challenge_06_tests;

use sui::test_scenario;
use suisec_dojo::challenge_06_price_rounding as challenge_06;
use suisec_dojo::user_progress::{Self, UserProgress};

const ALICE: address = @0xA11CE;
const BOB: address = @0xB0B;

#[test]
fun should_claim_instance_for_sender() {
    let mut scenario = test_scenario::begin(ALICE);
    user_progress::create(test_scenario::ctx(&mut scenario));

    test_scenario::next_tx(&mut scenario, ALICE);
    let mut progress: UserProgress = test_scenario::take_from_sender(&scenario);
    challenge_06::claim(&mut progress, test_scenario::ctx(&mut scenario));
    test_scenario::return_to_sender(&scenario, progress);

    test_scenario::next_tx(&mut scenario, ALICE);
    let instance: challenge_06::ChallengeInstance = test_scenario::take_from_sender(&scenario);
    assert!(challenge_06::owner(&instance) == ALICE, 0);
    assert!(challenge_06::challenge_id(&instance) == 6, 1);
    assert!(challenge_06::credits(&instance) == 0, 2);
    assert!(challenge_06::paid_amount(&instance) == 0, 3);
    challenge_06::destroy_for_testing(instance);

    let progress: UserProgress = test_scenario::take_from_sender(&scenario);
    user_progress::destroy_for_testing(progress);
    test_scenario::end(scenario);
}

#[test]
fun should_apply_normal_large_buy_result() {
    let mut scenario = test_scenario::begin(ALICE);
    let mut instance = challenge_06::new_instance_for_testing(ALICE, test_scenario::ctx(&mut scenario));

    challenge_06::vulnerable_buy(&mut instance, 10);

    assert!(challenge_06::credits(&instance) == 1, 0);
    assert!(challenge_06::paid_amount(&instance) == 10, 1);

    challenge_06::destroy_for_testing(instance);
    test_scenario::end(scenario);
}

#[test]
fun should_accumulate_extra_credits_from_small_buys() {
    let mut scenario = test_scenario::begin(ALICE);
    let mut instance = challenge_06::new_instance_for_testing(ALICE, test_scenario::ctx(&mut scenario));

    let mut i = 0u64;
    while (i < 10) {
        challenge_06::vulnerable_buy(&mut instance, 1);
        i = i + 1u64;
    };

    assert!(challenge_06::credits(&instance) == 10, 0);
    assert!(challenge_06::paid_amount(&instance) == 10, 1);

    challenge_06::destroy_for_testing(instance);
    test_scenario::end(scenario);
}

#[test]
#[expected_failure(abort_code = ::suisec_dojo::challenge_06_price_rounding::EInvalidPayment)]
fun should_reject_zero_payment() {
    let mut scenario = test_scenario::begin(ALICE);
    let mut instance = challenge_06::new_instance_for_testing(ALICE, test_scenario::ctx(&mut scenario));

    challenge_06::vulnerable_buy(&mut instance, 0);

    challenge_06::destroy_for_testing(instance);
    test_scenario::end(scenario);
}

#[test]
#[expected_failure(abort_code = ::suisec_dojo::challenge_06_price_rounding::EInvalidSolution)]
fun should_reject_solve_before_enough_credits() {
    let mut scenario = test_scenario::begin(ALICE);
    let mut progress = user_progress::new_for_owner(ALICE, test_scenario::ctx(&mut scenario));
    let mut instance = challenge_06::new_instance_for_testing(ALICE, test_scenario::ctx(&mut scenario));

    challenge_06::vulnerable_buy(&mut instance, 1);
    challenge_06::solve(&mut instance, &mut progress, test_scenario::ctx(&mut scenario));

    challenge_06::destroy_for_testing(instance);
    user_progress::destroy_for_testing(progress);
    test_scenario::end(scenario);
}

#[test]
fun should_solve_after_rounding_exploit() {
    let mut scenario = test_scenario::begin(ALICE);
    let mut progress = user_progress::new_for_owner(ALICE, test_scenario::ctx(&mut scenario));
    let mut instance = challenge_06::new_instance_for_testing(ALICE, test_scenario::ctx(&mut scenario));

    let mut i = 0u64;
    while (i < 10) {
        challenge_06::vulnerable_buy(&mut instance, 1);
        i = i + 1u64;
    };
    challenge_06::solve(&mut instance, &mut progress, test_scenario::ctx(&mut scenario));

    assert!(challenge_06::is_solved(&instance), 0);
    assert!(user_progress::has_completed(&progress, 6), 1);

    challenge_06::destroy_for_testing(instance);
    user_progress::destroy_for_testing(progress);
    test_scenario::end(scenario);
}

#[test]
#[expected_failure(abort_code = ::suisec_dojo::challenge_06_price_rounding::ENotOwner)]
fun should_reject_non_owner_solve_attempt() {
    let mut scenario = test_scenario::begin(ALICE);
    let mut progress = user_progress::new_for_owner(ALICE, test_scenario::ctx(&mut scenario));
    let mut instance = challenge_06::new_instance_for_testing(ALICE, test_scenario::ctx(&mut scenario));

    let mut i = 0u64;
    while (i < 10) {
        challenge_06::vulnerable_buy(&mut instance, 1);
        i = i + 1u64;
    };

    test_scenario::next_tx(&mut scenario, BOB);
    challenge_06::solve(&mut instance, &mut progress, test_scenario::ctx(&mut scenario));

    challenge_06::destroy_for_testing(instance);
    user_progress::destroy_for_testing(progress);
    test_scenario::end(scenario);
}

#[test]
#[expected_failure(abort_code = ::suisec_dojo::challenge_06_price_rounding::EAlreadySolved)]
fun should_reject_duplicate_solve() {
    let mut scenario = test_scenario::begin(ALICE);
    let mut progress = user_progress::new_for_owner(ALICE, test_scenario::ctx(&mut scenario));
    let mut instance = challenge_06::new_instance_for_testing(ALICE, test_scenario::ctx(&mut scenario));

    let mut i = 0u64;
    while (i < 10) {
        challenge_06::vulnerable_buy(&mut instance, 1);
        i = i + 1u64;
    };
    challenge_06::solve(&mut instance, &mut progress, test_scenario::ctx(&mut scenario));
    challenge_06::solve(&mut instance, &mut progress, test_scenario::ctx(&mut scenario));

    challenge_06::destroy_for_testing(instance);
    user_progress::destroy_for_testing(progress);
    test_scenario::end(scenario);
}
