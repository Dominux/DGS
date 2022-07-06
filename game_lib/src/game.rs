use crate::{
    aliases::PointID,
    errors::{GameError, GameResult},
    field::interface::Field,
    group::Group,
    point::PlayerColor,
    rules::interface::GameRules,
    state::GameState,
};

/// Low level game struct
#[derive(Debug)]
pub struct Game<'a, F, R>
where
    F: Field,
    R: GameRules,
{
    state: GameState,
    rules: R,
    field: F,
    groups: Vec<Group<'a, F>>,
    move_number: Option<usize>,
    black_score: Option<usize>,
    white_score: Option<usize>,
}

impl<'a, F, R> Game<'a, F, R>
where
    F: Field,
    R: GameRules,
{
    pub fn new(field: F, rules: R) -> Self {
        Self {
            state: GameState::default(),
            field,
            rules,
            groups: vec![],
            move_number: None,
            black_score: None,
            white_score: None,
        }
    }

    /// Main function to perform moves
    pub fn do_move(&mut self, point_id: &PointID) -> GameResult<()> {
        // Validation
        if !self.is_started() {
            return Err(GameError::GameStateError {
                current: self.state,
                action: "move".to_string(),
            });
        }

        // Main algorithm

        Ok(())
    }

    #[inline]
    pub fn player_turn(&self) -> Option<PlayerColor> {
        self.move_number.map(|n| match n % 2 {
            1 => PlayerColor::White,
            _ => PlayerColor::Black,
        })
    }

    ///////////////////////////////////////////////////////////
    ///     State management
    ///////////////////////////////////////////////////////////

    #[inline]
    pub fn start(&mut self) -> GameResult<()> {
        // Validation
        if !self.is_not_started() {
            return Err(GameError::GameStateError {
                current: self.state,
                action: "starting game".to_string(),
            });
        }

        self.state = GameState::Started;
        self.move_number = Some(1);
        self.black_score = Some(0);
        self.white_score = Some(0);
        Ok(())
    }

    #[inline]
    pub fn end(&mut self) -> GameResult<()> {
        // Validation
        if !self.is_started() {
            return Err(GameError::GameStateError {
                current: self.state,
                action: "ending game".to_string(),
            });
        }

        self.state = GameState::Started;
        self.move_number = Some(1);
        self.black_score = Some(0);
        self.white_score = Some(0);
        Ok(())
    }

    #[inline]
    pub fn is_not_started(&self) -> bool {
        matches!(self.state, GameState::NotStarted)
    }

    #[inline]
    pub fn is_started(&self) -> bool {
        matches!(self.state, GameState::Started)
    }

    #[inline]
    pub fn is_ended(&self) -> bool {
        matches!(self.state, GameState::Ended)
    }
}
