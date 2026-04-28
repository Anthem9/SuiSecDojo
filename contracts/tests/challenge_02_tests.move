#[test_only]
module suisec_dojo::challenge_02_tests;

use sui::test_scenario;
use suisec_dojo::challenge_02_shared_vault as challenge_02;
use suisec_dojo::user_progress::{Self, UserProgress};

const ALICE: address = @0xA11CE;
const BOB: address = @0xB0B;

#[test]
fun should_claim_shared_vault_instance_for_sender() {
    let mut scenario = test_scenario::begin(ALICE);
    {
        user_progress::create(test_scenario::ctx(&mut scenario));
    };

    test_scenario::next_tx(&mut scenario, ALICE);
    {
        let mut progress: UserProgress = test_scenario::take_from_sender(&scenario);

        challenge_02::claim(&mut progress, test_scenario::ctx(&mut scenario));
        assert!(user_progress::has_claimed(&progress, 2));

        test_scenario::return_to_sender(&scenario, progress);
    };

    test_scenario::next_tx(&mut scenario, ALICE);
    {
        let progress: UserProgress = test_scenario::take_from_sender(&scenario);
        let instance: challenge_02::ChallengeInstance = test_scenario::take_from_sender(&scenario);
        let vault: challenge_02::SharedVault = test_scenario::take_shared(&scenario);

        assert!(challenge_02::owner(&instance) == ALICE);
        assert!(challenge_02::challenge_id(&instance) == 2);
        assert!(challenge_02::vault_id(&instance) == challenge_02::vault_object_id(&vault));
        assert!(challenge_02::vault_owner(&vault) == ALICE);
        assert!(challenge_02::vault_balance(&vault) == challenge_02::initial_vault_balance_for_testing());
        assert!(!challenge_02::is_solved(&instance));

        user_progress::destroy_for_testing(progress);
        challenge_02::destroy_instance_for_testing(instance);
        challenge_02::destroy_vault_for_testing(vault);
    };
    test_scenario::end(scenario);
}

#[test]
fun should_allow_non_owner_to_withdraw_from_shared_vault() {
    let mut scenario = test_scenario::begin(ALICE);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let vault = challenge_02::new_vault_for_testing(ALICE, ctx);
        challenge_02::share_vault_for_testing(vault);
    };

    test_scenario::next_tx(&mut scenario, BOB);
    {
        let mut vault: challenge_02::SharedVault = test_scenario::take_shared(&scenario);

        challenge_02::vulnerable_withdraw(&mut vault, challenge_02::initial_vault_balance_for_testing());
        assert!(challenge_02::vault_balance(&vault) == 0);

        challenge_02::destroy_vault_for_testing(vault);
    };
    test_scenario::end(scenario);
}

#[test]
fun should_solve_after_vault_is_drained() {
    let mut scenario = test_scenario::begin(ALICE);
    {
        user_progress::create(test_scenario::ctx(&mut scenario));
    };

    test_scenario::next_tx(&mut scenario, ALICE);
    {
        let mut progress: UserProgress = test_scenario::take_from_sender(&scenario);
        challenge_02::claim(&mut progress, test_scenario::ctx(&mut scenario));
        test_scenario::return_to_sender(&scenario, progress);
    };

    test_scenario::next_tx(&mut scenario, BOB);
    {
        let mut vault: challenge_02::SharedVault = test_scenario::take_shared(&scenario);
        challenge_02::vulnerable_withdraw(&mut vault, challenge_02::initial_vault_balance_for_testing());
        test_scenario::return_shared(vault);
    };

    test_scenario::next_tx(&mut scenario, ALICE);
    {
        let mut progress: UserProgress = test_scenario::take_from_sender(&scenario);
        let mut instance: challenge_02::ChallengeInstance = test_scenario::take_from_sender(&scenario);
        let vault: challenge_02::SharedVault = test_scenario::take_shared(&scenario);

        challenge_02::solve(&mut instance, &vault, &mut progress, test_scenario::ctx(&mut scenario));

        assert!(challenge_02::is_solved(&instance));
        assert!(user_progress::has_completed(&progress, 2));

        user_progress::destroy_for_testing(progress);
        challenge_02::destroy_instance_for_testing(instance);
        challenge_02::destroy_vault_for_testing(vault);
    };
    test_scenario::end(scenario);
}

#[test, expected_failure(abort_code = ::suisec_dojo::challenge_02_shared_vault::EInvalidSolution)]
fun should_reject_solve_before_vault_is_drained() {
    let mut scenario = test_scenario::begin(ALICE);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let vault = challenge_02::new_vault_for_testing(ALICE, ctx);
        let mut instance = challenge_02::new_instance_for_testing(ALICE, challenge_02::vault_object_id(&vault), ctx);
        let mut progress = user_progress::new_for_owner(ALICE, ctx);

        challenge_02::solve(&mut instance, &vault, &mut progress, ctx);

        challenge_02::destroy_instance_for_testing(instance);
        challenge_02::destroy_vault_for_testing(vault);
        user_progress::destroy_for_testing(progress);
    };
    test_scenario::end(scenario);
}

#[test, expected_failure(abort_code = ::suisec_dojo::challenge_02_shared_vault::EAlreadySolved)]
fun should_reject_duplicate_solve() {
    let mut scenario = test_scenario::begin(ALICE);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let mut vault = challenge_02::new_vault_for_testing(ALICE, ctx);
        let mut instance = challenge_02::new_instance_for_testing(ALICE, challenge_02::vault_object_id(&vault), ctx);
        let mut progress = user_progress::new_for_owner(ALICE, ctx);

        challenge_02::vulnerable_withdraw(&mut vault, challenge_02::initial_vault_balance_for_testing());
        challenge_02::solve(&mut instance, &vault, &mut progress, ctx);
        challenge_02::solve(&mut instance, &vault, &mut progress, ctx);

        challenge_02::destroy_instance_for_testing(instance);
        challenge_02::destroy_vault_for_testing(vault);
        user_progress::destroy_for_testing(progress);
    };
    test_scenario::end(scenario);
}

#[test, expected_failure(abort_code = ::suisec_dojo::challenge_02_shared_vault::ENotOwner)]
fun should_reject_non_owner_solve_attempt() {
    let mut scenario = test_scenario::begin(BOB);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let mut vault = challenge_02::new_vault_for_testing(ALICE, ctx);
        let mut instance = challenge_02::new_instance_for_testing(ALICE, challenge_02::vault_object_id(&vault), ctx);
        let mut progress = user_progress::new_for_owner(ALICE, ctx);

        challenge_02::vulnerable_withdraw(&mut vault, challenge_02::initial_vault_balance_for_testing());
        challenge_02::solve(&mut instance, &vault, &mut progress, ctx);

        challenge_02::destroy_instance_for_testing(instance);
        challenge_02::destroy_vault_for_testing(vault);
        user_progress::destroy_for_testing(progress);
    };
    test_scenario::end(scenario);
}
