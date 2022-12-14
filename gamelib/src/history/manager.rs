use std::collections::HashSet;

use crate::{
    errors::{GameError, GameResult},
    field::build_field,
    game::Game,
    group::Group,
    state::GameState,
    PlayerColor,
};

use super::{StoredGame, StoredGameMove, StoredGameMoveType};

/// Manager to convert game to history and vice versa
pub(crate) struct HistoryManager {
    history: StoredGame,
}

impl HistoryManager {
    pub(crate) fn new(history: StoredGame) -> Self {
        Self { history }
    }

    pub(crate) fn load(&self) -> GameResult<Game> {
        // Creating a field
        let field = build_field(&self.history.meta.size, self.history.meta.field_type)?;
        let mut black_stones = HashSet::new();
        let mut white_stones = HashSet::new();
        let mut black_score = 0;
        let mut white_score = 0;

        let mut is_game_finished = false;
        let mut move_number = 1;

        // Going through the history
        for record in self.history.moves.iter() {
            move_number += 1;

            match record.move_type {
                StoredGameMoveType::Move => (),
                StoredGameMoveType::Pass => continue,
                StoredGameMoveType::Surrender => {
                    is_game_finished = true;
                    break;
                }
            }

            // Converting to players/enemies context
            let reminder = move_number % 2;
            let (mut players_stones, mut enemies_stones, mut players_score) = match reminder {
                0 => (white_stones, black_stones, white_score),
                _ => (black_stones, white_stones, black_score),
            };

            // Main move processing
            {
                let point_id = record.point_id.expect("expected point ID");
                players_stones.insert(point_id);

                if !record.died.is_empty() {
                    players_score += record.died.len();
                    enemies_stones = &enemies_stones - &record.died;
                }
            }

            // Converting back
            if reminder == 0 {
                white_stones = players_stones;
                black_stones = enemies_stones;
                white_score = players_score;
            } else {
                black_stones = players_stones;
                white_stones = enemies_stones;
                black_score = players_score;
            }
        }

        let state = if is_game_finished {
            GameState::Ended
        } else {
            GameState::Started
        };

        // Creating groups
        let black_groups = Group::new_from_points(black_stones, &field, &PlayerColor::Black);
        let white_groups = Group::new_from_points(white_stones, &field, &PlayerColor::White);

        Ok(Game::new_with_all_fields(
            state,
            field,
            black_groups,
            white_groups,
            Some(move_number),
            Some(black_score),
            Some(white_score),
        ))
    }

    pub(crate) fn append_record(&mut self, record: StoredGameMove) {
        self.history.moves.push(record)
    }

    pub(crate) fn pop_record(&mut self) -> GameResult<()> {
        self.history
            .moves
            .pop()
            .ok_or(GameError::UndoOnClearHistory)
            .map(|_| ())
    }
}
