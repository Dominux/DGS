use std::collections::HashSet;

use crate::{
    errors::{GameError, GameResult},
    field::{build_field, Field},
    game::Game,
    group::Group,
    state::GameState,
    PlayerColor, PointID,
};

use super::{StoredGame, StoredGameMoveType};

pub(crate) fn load_game(history: &StoredGame) -> GameResult<Game> {
    // Creating a field
    let mut field = build_field(&history.meta.size, history.meta.field_type)?;
    let mut black_stones = HashSet::new();
    let mut white_stones = HashSet::new();
    let mut black_score = 0;
    let mut white_score = 0;
    let mut blocked = HashSet::new();

    let mut is_game_finished = false;
    let mut move_number = 1;

    // Going through the history
    for record in history.moves {
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

            blocked = record.blocked;
            enemies_stones = &enemies_stones - &record.died;
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

    fn convert_stones_to_groups(
        stones: HashSet<PointID>,
        field: &Field,
        color: &PlayerColor,
    ) -> Vec<Group> {
        let iter = stones.iter();
        // TODO: create a way to easily create groups from points
        // let first_stone = iter.next().ok_or(GameError::);

        // let group = Group::new(, field, color);
    }

    Ok(Game::new_with_all_fields(
        state,
        field,
        black_groups,
        white_groups,
        move_number,
        black_score,
        white_score,
    ))
}
