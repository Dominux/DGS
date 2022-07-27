#[derive(Debug, Clone, Copy)]
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
