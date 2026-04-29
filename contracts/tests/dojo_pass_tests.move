#[allow(duplicate_alias)]
module suisec_dojo::dojo_pass_tests;

use sui::balance;
use sui::coin;
use sui::object::ID;
use sui::sui::SUI;
use sui::test_scenario as ts;
use std::option;
use suisec_dojo::badge::{Self, Badge};
use suisec_dojo::dojo_pass::{Self, DojoPass, DojoPassConfig};

const ADMIN: address = @0xA11CE;
const USER: address = @0xB0B;
const PROOF_PUBLIC_KEY: vector<u8> = x"36d6cd844d56339babb51bfa4c36dca713a20ac49c6f1c35c1885c0a1ab425aa";
const VALID_SIGNATURE: vector<u8> = x"92bd0d4b610f1df05b0ca1eddf44a8f34dd139518b7ef11682a7ada93ff78e3b132908a7cc9e071da5bd742faae4fcc08d1ac335e13f252a4a8e056c60b5c70b";
const INVALID_SIGNATURE: vector<u8> = x"93bd0d4b610f1df05b0ca1eddf44a8f34dd139518b7ef11682a7ada93ff78e3b132908a7cc9e071da5bd742faae4fcc08d1ac335e13f252a4a8e056c60b5c70b";

#[test]
fun should_mint_one_soulbound_pass_per_address() {
    let mut scenario = setup();
    let config_id = option::destroy_some(ts::most_recent_id_shared<DojoPassConfig>());

    mint_pass_for(&mut scenario, config_id, USER);
    ts::next_tx(&mut scenario, USER);
    let pass: DojoPass = ts::take_from_sender(&scenario);
    assert!(dojo_pass::owner(&pass) == USER);
    assert!(dojo_pass::membership_tier(&pass) == 0);
    dojo_pass::destroy_pass_for_testing(pass);

    cleanup_config(&mut scenario, config_id, 0);
    ts::end(scenario);
}

#[test, expected_failure(abort_code = ::suisec_dojo::dojo_pass::EAlreadyMintedPass)]
fun should_reject_duplicate_pass_mint() {
    let mut scenario = setup();
    let config_id = option::destroy_some(ts::most_recent_id_shared<DojoPassConfig>());

    mint_pass_for(&mut scenario, config_id, USER);
    ts::next_tx(&mut scenario, USER);
    let pass: DojoPass = ts::take_from_sender(&scenario);
    dojo_pass::destroy_pass_for_testing(pass);

    mint_pass_for(&mut scenario, config_id, USER);
    abort 999
}

#[test]
fun should_unlock_answer_with_pass() {
    let mut scenario = setup();
    let config_id = option::destroy_some(ts::most_recent_id_shared<DojoPassConfig>());
    mint_pass_for(&mut scenario, config_id, USER);

    ts::next_tx(&mut scenario, USER);
    let mut config: DojoPassConfig = ts::take_shared_by_id(&scenario, config_id);
    let mut pass: DojoPass = ts::take_from_sender(&scenario);
    let payment = coin::mint_for_testing<SUI>(100, ts::ctx(&mut scenario));
    dojo_pass::unlock_answer(&mut config, &mut pass, 7, payment, ts::ctx(&mut scenario));
    assert!(dojo_pass::has_unlocked_answer(&pass, 7));
    assert!(dojo_pass::collected(&config) == 100);
    dojo_pass::return_pass_for_testing(pass, USER);
    ts::return_shared(config);

    ts::next_tx(&mut scenario, USER);
    let pass: DojoPass = ts::take_from_sender(&scenario);
    dojo_pass::destroy_pass_for_testing(pass);

    cleanup_config(&mut scenario, config_id, 100);
    ts::end(scenario);
}

#[test]
fun should_approve_seal_access_after_unlock() {
    let mut scenario = setup();
    let config_id = option::destroy_some(ts::most_recent_id_shared<DojoPassConfig>());
    mint_pass_for(&mut scenario, config_id, USER);

    ts::next_tx(&mut scenario, USER);
    let mut config: DojoPassConfig = ts::take_shared_by_id(&scenario, config_id);
    let mut pass: DojoPass = ts::take_from_sender(&scenario);
    dojo_pass::unlock_answer(&mut config, &mut pass, 7, coin::mint_for_testing<SUI>(100, ts::ctx(&mut scenario)), ts::ctx(&mut scenario));
    dojo_pass::seal_approve(&pass, 7, ts::ctx(&mut scenario));
    dojo_pass::return_pass_for_testing(pass, USER);
    ts::return_shared(config);

    ts::next_tx(&mut scenario, USER);
    let pass: DojoPass = ts::take_from_sender(&scenario);
    dojo_pass::destroy_pass_for_testing(pass);

    cleanup_config(&mut scenario, config_id, 100);
    ts::end(scenario);
}

#[test, expected_failure(abort_code = ::suisec_dojo::dojo_pass::ENotUnlocked)]
fun should_reject_seal_access_before_unlock() {
    let mut scenario = setup();
    let config_id = option::destroy_some(ts::most_recent_id_shared<DojoPassConfig>());
    mint_pass_for(&mut scenario, config_id, USER);

    ts::next_tx(&mut scenario, USER);
    let pass: DojoPass = ts::take_from_sender(&scenario);
    dojo_pass::seal_approve(&pass, 7, ts::ctx(&mut scenario));
    abort 999
}

#[test, expected_failure(abort_code = ::suisec_dojo::dojo_pass::EAlreadyUnlocked)]
fun should_reject_duplicate_answer_unlock() {
    let mut scenario = setup();
    let config_id = option::destroy_some(ts::most_recent_id_shared<DojoPassConfig>());
    mint_pass_for(&mut scenario, config_id, USER);

    ts::next_tx(&mut scenario, USER);
    let mut config: DojoPassConfig = ts::take_shared_by_id(&scenario, config_id);
    let mut pass: DojoPass = ts::take_from_sender(&scenario);
    dojo_pass::unlock_answer(&mut config, &mut pass, 1, coin::mint_for_testing<SUI>(100, ts::ctx(&mut scenario)), ts::ctx(&mut scenario));
    dojo_pass::unlock_answer(&mut config, &mut pass, 1, coin::mint_for_testing<SUI>(100, ts::ctx(&mut scenario)), ts::ctx(&mut scenario));
    abort 999
}

#[test]
fun should_mint_badge_with_valid_signed_proof() {
    let mut scenario = setup();
    let config_id = option::destroy_some(ts::most_recent_id_shared<DojoPassConfig>());
    mint_pass_for(&mut scenario, config_id, USER);

    ts::next_tx(&mut scenario, USER);
    let mut config: DojoPassConfig = ts::take_shared_by_id(&scenario, config_id);
    let mut pass: DojoPass = ts::take_from_sender(&scenario);
    let payment = coin::mint_for_testing<SUI>(500, ts::ctx(&mut scenario));
    let badge = dojo_pass::mint_badge(&mut config, &mut pass, 3, 10, 42, VALID_SIGNATURE, payment, ts::ctx(&mut scenario));
    assert!(dojo_pass::has_minted_badge(&pass, 3));
    assert!(dojo_pass::collected(&config) == 500);
    dojo_pass::return_pass_for_testing(pass, USER);
    transfer::public_transfer(badge, USER);
    ts::return_shared(config);

    ts::next_tx(&mut scenario, USER);
    let pass: DojoPass = ts::take_from_sender(&scenario);
    let badge: Badge = ts::take_from_sender(&scenario);
    assert!(badge::owner(&badge) == USER);
    assert!(badge::badge_type(&badge) == 3);
    dojo_pass::destroy_pass_for_testing(pass);
    badge::destroy_for_testing(badge);

    cleanup_config(&mut scenario, config_id, 500);
    ts::end(scenario);
}

#[test, expected_failure(abort_code = ::suisec_dojo::dojo_pass::EInvalidProof)]
fun should_reject_invalid_badge_proof() {
    let mut scenario = setup();
    let config_id = option::destroy_some(ts::most_recent_id_shared<DojoPassConfig>());
    mint_pass_for(&mut scenario, config_id, USER);

    ts::next_tx(&mut scenario, USER);
    let mut config: DojoPassConfig = ts::take_shared_by_id(&scenario, config_id);
    let mut pass: DojoPass = ts::take_from_sender(&scenario);
    let payment = coin::mint_for_testing<SUI>(500, ts::ctx(&mut scenario));
    let badge = dojo_pass::mint_badge(&mut config, &mut pass, 3, 10, 42, INVALID_SIGNATURE, payment, ts::ctx(&mut scenario));
    badge::destroy_for_testing(badge);
    abort 999
}

#[test, expected_failure(abort_code = ::suisec_dojo::dojo_pass::EAlreadyMintedBadge)]
fun should_reject_duplicate_badge_mint() {
    let mut scenario = setup();
    let config_id = option::destroy_some(ts::most_recent_id_shared<DojoPassConfig>());
    mint_pass_for(&mut scenario, config_id, USER);

    ts::next_tx(&mut scenario, USER);
    let mut config: DojoPassConfig = ts::take_shared_by_id(&scenario, config_id);
    let mut pass: DojoPass = ts::take_from_sender(&scenario);
    let badge = dojo_pass::mint_badge(
        &mut config,
        &mut pass,
        3,
        10,
        42,
        VALID_SIGNATURE,
        coin::mint_for_testing<SUI>(500, ts::ctx(&mut scenario)),
        ts::ctx(&mut scenario),
    );
    badge::destroy_for_testing(badge);
    let duplicate = dojo_pass::mint_badge(
        &mut config,
        &mut pass,
        3,
        10,
        42,
        VALID_SIGNATURE,
        coin::mint_for_testing<SUI>(500, ts::ctx(&mut scenario)),
        ts::ctx(&mut scenario),
    );
    badge::destroy_for_testing(duplicate);
    abort 999
}

fun setup(): ts::Scenario {
    let mut scenario = ts::begin(ADMIN);
    {
        dojo_pass::create_config(ADMIN, 100, 500, PROOF_PUBLIC_KEY, ts::ctx(&mut scenario));
    };
    ts::next_tx(&mut scenario, ADMIN);
    scenario
}

fun mint_pass_for(scenario: &mut ts::Scenario, config_id: ID, owner: address) {
    ts::next_tx(scenario, owner);
    let mut config: DojoPassConfig = ts::take_shared_by_id(scenario, config_id);
    dojo_pass::mint_pass(&mut config, ts::ctx(scenario));
    ts::return_shared(config);
}

fun cleanup_config(scenario: &mut ts::Scenario, config_id: ID, expected_amount: u64) {
    ts::next_tx(scenario, ADMIN);
    let mut config: DojoPassConfig = ts::take_shared_by_id(scenario, config_id);
    assert!(dojo_pass::collected(&config) == expected_amount);
    if (expected_amount > 0) {
        let payment = dojo_pass::withdraw(&mut config, ts::ctx(scenario));
        assert!(dojo_pass::collected(&config) == 0);
        assert!(balance::destroy_for_testing(coin::into_balance(payment)) == expected_amount);
    };
    dojo_pass::destroy_config_for_testing(config);
}
