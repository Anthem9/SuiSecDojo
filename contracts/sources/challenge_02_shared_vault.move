#[allow(duplicate_alias)]
module suisec_dojo::challenge_02_shared_vault;

use sui::object::{Self, ID, UID};
use sui::transfer;
use sui::tx_context::{Self, TxContext};
use suisec_dojo::challenge_events;
use suisec_dojo::user_progress::{Self, UserProgress};

public struct SharedVault has key {
    id: UID,
    owner: address,
    balance: u64,
}

public struct ChallengeInstance has key, store {
    id: UID,
    challenge_id: u64,
    owner: address,
    vault_id: ID,
    solved: bool,
}

const CHALLENGE_ID: u64 = 2;
const BASE_SCORE: u64 = 150;
const INITIAL_VAULT_BALANCE: u64 = 100;
const ENotOwner: u64 = 1;
const EAlreadySolved: u64 = 2;
const EInvalidSolution: u64 = 3;
const EInvalidVault: u64 = 4;
const EInsufficientBalance: u64 = 5;

public fun new_vault(owner: address, ctx: &mut TxContext): SharedVault {
    SharedVault {
        id: object::new(ctx),
        owner,
        balance: INITIAL_VAULT_BALANCE,
    }
}

public fun new_instance(owner: address, vault_id: ID, ctx: &mut TxContext): ChallengeInstance {
    ChallengeInstance {
        id: object::new(ctx),
        challenge_id: CHALLENGE_ID,
        owner,
        vault_id,
        solved: false,
    }
}

public(package) entry fun claim(progress: &mut UserProgress, ctx: &mut TxContext) {
    let sender = tx_context::sender(ctx);
    user_progress::mark_claimed(progress, CHALLENGE_ID, sender);

    let vault = new_vault(sender, ctx);
    let vault_id = object::id(&vault);
    transfer::share_object(vault);
    transfer::transfer(new_instance(sender, vault_id, ctx), sender);
}

public(package) entry fun vulnerable_withdraw(vault: &mut SharedVault, amount: u64) {
    // Intentionally vulnerable: anyone can drain the shared vault; owner is not checked.
    assert!(vault.balance >= amount, EInsufficientBalance);
    vault.balance = vault.balance - amount;
}

public(package) entry fun solve(
    instance: &mut ChallengeInstance,
    vault: &SharedVault,
    progress: &mut UserProgress,
    mode: u8,
    assistance_level: u8,
    ctx: &mut TxContext,
) {
    let sender = tx_context::sender(ctx);
    assert!(instance.owner == sender, ENotOwner);
    assert!(!instance.solved, EAlreadySolved);
    assert!(instance.vault_id == object::id(vault), EInvalidVault);
    assert!(vault.balance == 0, EInvalidSolution);

    instance.solved = true;
    user_progress::mark_completed(progress, CHALLENGE_ID, sender);
    challenge_events::emit_completion(CHALLENGE_ID, sender, 0, BASE_SCORE, mode, assistance_level, ctx);
}

public fun challenge_id(instance: &ChallengeInstance): u64 {
    instance.challenge_id
}

public fun owner(instance: &ChallengeInstance): address {
    instance.owner
}

public fun vault_id(instance: &ChallengeInstance): ID {
    instance.vault_id
}

public fun is_solved(instance: &ChallengeInstance): bool {
    instance.solved
}

public fun vault_object_id(vault: &SharedVault): ID {
    object::id(vault)
}

public fun vault_owner(vault: &SharedVault): address {
    vault.owner
}

public fun vault_balance(vault: &SharedVault): u64 {
    vault.balance
}

#[test_only]
public fun initial_vault_balance_for_testing(): u64 {
    INITIAL_VAULT_BALANCE
}

#[test_only]
public fun new_vault_for_testing(owner: address, ctx: &mut TxContext): SharedVault {
    new_vault(owner, ctx)
}

#[test_only]
public fun new_instance_for_testing(owner: address, vault_id: ID, ctx: &mut TxContext): ChallengeInstance {
    new_instance(owner, vault_id, ctx)
}

#[test_only]
public fun share_vault_for_testing(vault: SharedVault) {
    transfer::share_object(vault);
}

#[test_only]
public fun destroy_instance_for_testing(instance: ChallengeInstance) {
    let ChallengeInstance { id, challenge_id: _, owner: _, vault_id: _, solved: _ } = instance;
    object::delete(id);
}

#[test_only]
public fun destroy_vault_for_testing(vault: SharedVault) {
    let SharedVault { id, owner: _, balance: _ } = vault;
    object::delete(id);
}
