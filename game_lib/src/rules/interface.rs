/// Trait for any rules that control the game process
pub trait GameRules {
    fn can_commit_suicide(&self) -> bool;
}
