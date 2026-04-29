#[test_only]
module suisec_dojo::challenge_scoring_tests;

use suisec_dojo::challenge_scoring;

#[test]
fun should_score_challenge_mode_without_assistance() {
    assert!(challenge_scoring::calculate(100, challenge_scoring::mode_challenge(), challenge_scoring::assistance_none()) == 100);
}

#[test]
fun should_discount_guided_mode() {
    assert!(challenge_scoring::calculate(150, challenge_scoring::mode_guided(), 0) == 60);
}

#[test]
fun should_apply_assistance_penalties() {
    assert!(challenge_scoring::calculate(200, 1, 1) == 180);
    assert!(challenge_scoring::calculate(200, 1, 2) == 150);
    assert!(challenge_scoring::calculate(200, 1, 3) == 100);
}

#[test]
fun should_zero_score_after_answer() {
    assert!(challenge_scoring::calculate(400, 1, challenge_scoring::assistance_answer()) == 0);
}

#[test, expected_failure(abort_code = ::suisec_dojo::challenge_scoring::EInvalidMode)]
fun should_reject_invalid_mode() {
    challenge_scoring::calculate(100, 9, 0);
}

#[test, expected_failure(abort_code = ::suisec_dojo::challenge_scoring::EInvalidAssistanceLevel)]
fun should_reject_invalid_assistance_level() {
    challenge_scoring::calculate(100, 1, 5);
}
