use super::GameRules;

/// Japanese rules
#[derive(Debug, Clone)]
pub struct JapaneseRules;

impl JapaneseRules {
    pub fn new() -> Self {
        Self {}
    }
}

impl GameRules for JapaneseRules {
    fn can_commit_suicide(&self) -> bool {
        false
    }
}
