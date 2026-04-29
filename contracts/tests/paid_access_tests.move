#[allow(duplicate_alias)]
module suisec_dojo::paid_access_tests;

use sui::coin;
use sui::balance;
use sui::object::ID;
use sui::sui::SUI;
use sui::test_scenario as ts;
use std::option;
use suisec_dojo::paid_access::{Self, AnswerReceipt, PaidAccessConfig, PublicBadge};

const ADMIN: address = @0xA11CE;
const USER: address = @0xB0B;

#[test]
fun should_unlock_answer_with_configured_payment() {
    let mut scenario = ts::begin(ADMIN);
    {
        paid_access::create_config(ADMIN, 100, 500, ts::ctx(&mut scenario));
    };
    ts::next_tx(&mut scenario, ADMIN);
    let config_id = option::destroy_some(ts::most_recent_id_shared<PaidAccessConfig>());

    {
        ts::next_tx(&mut scenario, USER);
        let mut config: PaidAccessConfig = ts::take_shared_by_id(&scenario, config_id);
        let payment = coin::mint_for_testing<SUI>(100, ts::ctx(&mut scenario));
        let receipt = paid_access::unlock_answer(&mut config, 7, payment, ts::ctx(&mut scenario));
        assert!(paid_access::collected(&config) == 100);
        transfer::public_transfer(receipt, USER);
        ts::return_shared(config);
    };

    {
        ts::next_tx(&mut scenario, USER);
        let receipt: AnswerReceipt = ts::take_from_sender(&scenario);
        assert!(paid_access::receipt_owner(&receipt) == USER);
        assert!(paid_access::receipt_challenge_id(&receipt) == 7);
        paid_access::destroy_receipt_for_testing(receipt);
    };

    cleanup_config(&mut scenario, config_id, 100);
    ts::end(scenario);
}

#[test]
fun should_mint_public_badge_with_configured_payment() {
    let mut scenario = ts::begin(ADMIN);
    {
        paid_access::create_config(ADMIN, 100, 500, ts::ctx(&mut scenario));
    };
    ts::next_tx(&mut scenario, ADMIN);
    let config_id = option::destroy_some(ts::most_recent_id_shared<PaidAccessConfig>());

    {
        ts::next_tx(&mut scenario, USER);
        let mut config: PaidAccessConfig = ts::take_shared_by_id(&scenario, config_id);
        let payment = coin::mint_for_testing<SUI>(500, ts::ctx(&mut scenario));
        let badge = paid_access::mint_public_badge(&mut config, 3, payment, ts::ctx(&mut scenario));
        assert!(paid_access::collected(&config) == 500);
        transfer::public_transfer(badge, USER);
        ts::return_shared(config);
    };

    {
        ts::next_tx(&mut scenario, USER);
        let badge: PublicBadge = ts::take_from_sender(&scenario);
        assert!(paid_access::public_badge_owner(&badge) == USER);
        assert!(paid_access::public_badge_type(&badge) == 3);
        paid_access::destroy_public_badge_for_testing(badge);
    };

    cleanup_config(&mut scenario, config_id, 500);
    ts::end(scenario);
}

#[test, expected_failure(abort_code = ::suisec_dojo::paid_access::EInsufficientPayment)]
fun should_reject_underpaid_answer_unlock() {
    let mut scenario = ts::begin(ADMIN);
    {
        paid_access::create_config(ADMIN, 100, 500, ts::ctx(&mut scenario));
    };
    ts::next_tx(&mut scenario, ADMIN);
    let config_id = option::destroy_some(ts::most_recent_id_shared<PaidAccessConfig>());

    {
        ts::next_tx(&mut scenario, USER);
        let mut config: PaidAccessConfig = ts::take_shared_by_id(&scenario, config_id);
        let payment = coin::mint_for_testing<SUI>(99, ts::ctx(&mut scenario));
        let receipt = paid_access::unlock_answer(&mut config, 1, payment, ts::ctx(&mut scenario));
        paid_access::destroy_receipt_for_testing(receipt);
        ts::return_shared(config);
    };

    abort 999
}

#[test, expected_failure(abort_code = ::suisec_dojo::paid_access::ENotRecipient)]
fun should_reject_non_recipient_withdraw() {
    let mut scenario = ts::begin(ADMIN);
    {
        paid_access::create_config(ADMIN, 100, 500, ts::ctx(&mut scenario));
    };
    ts::next_tx(&mut scenario, ADMIN);
    let config_id = option::destroy_some(ts::most_recent_id_shared<PaidAccessConfig>());

    {
        ts::next_tx(&mut scenario, USER);
        let mut config: PaidAccessConfig = ts::take_shared_by_id(&scenario, config_id);
        let payment = coin::mint_for_testing<SUI>(100, ts::ctx(&mut scenario));
        let receipt = paid_access::unlock_answer(&mut config, 1, payment, ts::ctx(&mut scenario));
        paid_access::destroy_receipt_for_testing(receipt);
        ts::return_shared(config);
    };

    {
        ts::next_tx(&mut scenario, USER);
        let mut config: PaidAccessConfig = ts::take_shared_by_id(&scenario, config_id);
        let withdrawn = paid_access::withdraw(&mut config, ts::ctx(&mut scenario));
        assert!(balance::destroy_for_testing(coin::into_balance(withdrawn)) == 100);
        ts::return_shared(config);
    };

    abort 999
}

fun cleanup_config(scenario: &mut ts::Scenario, config_id: ID, expected_amount: u64) {
    ts::next_tx(scenario, ADMIN);
    let mut config: PaidAccessConfig = ts::take_shared_by_id(scenario, config_id);
    assert!(paid_access::collected(&config) == expected_amount);
    let payment = paid_access::withdraw(&mut config, ts::ctx(scenario));
    assert!(paid_access::collected(&config) == 0);
    paid_access::destroy_config_for_testing(config);
    assert!(coin::value(&payment) == expected_amount);
    assert!(balance::destroy_for_testing(coin::into_balance(payment)) == expected_amount);
}
