#[allow(duplicate_alias)]
module suisec_dojo::challenge_scoring;

const MODE_CHALLENGE: u8 = 1;
const MODE_GUIDED: u8 = 2;
const ASSISTANCE_NONE: u8 = 0;
const ASSISTANCE_CONCEPT: u8 = 1;
const ASSISTANCE_DIRECTION: u8 = 2;
const ASSISTANCE_CHECKLIST: u8 = 3;
const ASSISTANCE_ANSWER: u8 = 4;
const EInvalidMode: u64 = 1;
const EInvalidAssistanceLevel: u64 = 2;

public fun calculate(base_score: u64, mode: u8, assistance_level: u8): u64 {
    assert!(mode == MODE_CHALLENGE || mode == MODE_GUIDED, EInvalidMode);
    assert!(assistance_level <= ASSISTANCE_ANSWER, EInvalidAssistanceLevel);

    if (assistance_level == ASSISTANCE_ANSWER) {
        return 0
    };

    let mode_score = if (mode == MODE_GUIDED) { (base_score * 40) / 100 } else { base_score };
    let penalty_percent = if (assistance_level == ASSISTANCE_NONE) {
        0
    } else if (assistance_level == ASSISTANCE_CONCEPT) {
        10
    } else if (assistance_level == ASSISTANCE_DIRECTION) {
        25
    } else if (assistance_level == ASSISTANCE_CHECKLIST) {
        50
    } else {
        100
    };

    (mode_score * (100 - penalty_percent)) / 100
}

public fun mode_challenge(): u8 {
    MODE_CHALLENGE
}

public fun mode_guided(): u8 {
    MODE_GUIDED
}

public fun assistance_none(): u8 {
    ASSISTANCE_NONE
}

public fun assistance_answer(): u8 {
    ASSISTANCE_ANSWER
}
