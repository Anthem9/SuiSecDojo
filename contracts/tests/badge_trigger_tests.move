#[test_only]
module suisec_dojo::badge_trigger_tests;

use sui::test_scenario;
use suisec_dojo::challenge_01_anyone_can_mint as challenge_01;
use suisec_dojo::challenge_02_shared_vault as challenge_02;
use suisec_dojo::challenge_04_leaky_capability as challenge_04;
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

        challenge_01::destroy_for_testing(instance);
        user_progress::destroy_for_testing(progress);
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

        challenge_02::destroy_vault_for_testing(vault);
        challenge_02::destroy_instance_for_testing(instance);
        user_progress::destroy_for_testing(progress);
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

        challenge_04::destroy_cap_for_testing(cap);
        challenge_04::destroy_instance_for_testing(instance);
        user_progress::destroy_for_testing(progress);
    };
    test_scenario::end(scenario);
}
