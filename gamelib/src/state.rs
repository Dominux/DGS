#[derive(Debug, Clone, Copy, PartialEq)]
pub enum GameState {
    NotStarted,
    Started,
    Ended,
}

impl Default for GameState {
    fn default() -> Self {
        Self::NotStarted
    }
}
