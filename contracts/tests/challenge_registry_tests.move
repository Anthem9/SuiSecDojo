#[test_only]
module suisec_dojo::challenge_registry_tests;

use sui::test_scenario;
use suisec_dojo::challenge_registry::{Self, ChallengeRegistry};

const ADMIN: address = @0xAD;
const ATTACKER: address = @0xBAD;

#[test]
fun should_initialize_registry_for_sender() {
    let mut scenario = test_scenario::begin(ADMIN);
    {
        challenge_registry::init_registry(test_scenario::ctx(&mut scenario));
    };

    test_scenario::next_tx(&mut scenario, ADMIN);
    {
        let registry: ChallengeRegistry = test_scenario::take_from_sender(&scenario);

        assert!(challenge_registry::admin(&registry) == ADMIN);
        assert!(challenge_registry::challenge_count(&registry) == 0);

        challenge_registry::destroy_for_testing(registry);
    };
    test_scenario::end(scenario);
}

#[test]
fun should_allow_admin_to_register_challenge() {
    let mut scenario = test_scenario::begin(ADMIN);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let mut registry = challenge_registry::new_for_admin(ADMIN, ctx);

        challenge_registry::register_challenge(
            &mut registry,
            1,
            b"Anyone Can Mint",
            1,
            b"Object Security",
            b"walrus-blob-placeholder",
            true,
            ctx,
        );

        assert!(challenge_registry::challenge_count(&registry) == 1);
        assert!(challenge_registry::is_enabled(&registry, 1));

        challenge_registry::destroy_for_testing(registry);
    };
    test_scenario::end(scenario);
}

#[test, expected_failure(abort_code = ::suisec_dojo::challenge_registry::ENotAdmin)]
fun should_reject_non_admin_register() {
    let mut scenario = test_scenario::begin(ATTACKER);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let mut registry = challenge_registry::new_for_admin(ADMIN, ctx);

        challenge_registry::register_challenge(
            &mut registry,
            2,
            b"Shared Vault",
            2,
            b"Shared Object",
            b"walrus-blob-placeholder",
            true,
            ctx,
        );

        challenge_registry::destroy_for_testing(registry);
    };
    test_scenario::end(scenario);
}

#[test]
fun should_toggle_enabled_state() {
    let mut scenario = test_scenario::begin(ADMIN);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        let mut registry = challenge_registry::new_for_admin(ADMIN, ctx);

        challenge_registry::register_challenge(
            &mut registry,
            1,
            b"Anyone Can Mint",
            1,
            b"Object Security",
            b"walrus-blob-placeholder",
            true,
            ctx,
        );
        challenge_registry::set_enabled(&mut registry, 1, false, ctx);

        assert!(!challenge_registry::is_enabled(&registry, 1));

        challenge_registry::destroy_for_testing(registry);
    };
    test_scenario::end(scenario);
}
