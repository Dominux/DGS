use crate::{
    aliases::PointID,
    errors::{GameError, GameResult},
    field::Field,
    group::Group,
    point::{PlayerColor, PointStatus},
    rules::GameRules,
    state::GameState,
};

/// Low level game struct
#[derive(Debug)]
pub struct Game<F, R>
where
    F: Field,
    R: GameRules,
{
    state: GameState,
    rules: R,
    field: F,
    move_number: Option<usize>,
    black_groups: Vec<Group>,
    white_groups: Vec<Group>,
    black_score: Option<usize>,
    white_score: Option<usize>,
}

impl<F, R> Game<F, R>
where
    F: Field,
    R: GameRules,
{
    pub fn new(field: F, rules: R) -> Self {
        Self {
            state: GameState::default(),
            field,
            rules,
            black_groups: vec![],
            white_groups: vec![],
            move_number: None,
            black_score: None,
            white_score: None,
        }
    }

    ////////////////////////////////////////////////////////////////////
    /// Moving management
    ////////////////////////////////////////////////////////////////////

    /// Main function to perform moves
    pub fn do_move(&mut self, point_id: &PointID) -> GameResult<()> {
        // Validation
        if !self.is_started() {
            return Err(GameError::GameStateError {
                current: self.state,
                action: "move".to_string(),
            });
        }

        // Main move algorithm

        let player = self.player_turn().unwrap();
        let cloned_field = self.field.clone();
        let point = cloned_field.get_point(point_id);

        // 1. Checking if the point is empty and not blocked
        match point.borrow().inner.status {
            PointStatus::Blocked => return Err(GameError::PointBlocked(*point_id)),
            PointStatus::Occupied(_) => return Err(GameError::PointOccupied(*point_id)),
            PointStatus::Empty => (),
        }

        // 2. Occuping point and turning it into a group
        let mut group = {
            point.borrow_mut().inner.status = PointStatus::Occupied(player);
            Group::new(point_id, &cloned_field, &player)
        };

        // 3. Merging all the groups we got this move
        let (mut players_groups, mut player_score, mut enemies_groups, mut enemies_score) = {
            let (mut players_groups, player_score, mut enemies_groups, enemies_score) = match player
            {
                PlayerColor::Black => (
                    self.black_groups.clone(),
                    self.black_score.clone().unwrap(),
                    self.white_groups.clone(),
                    self.white_score.clone().unwrap(),
                ),
                PlayerColor::White => (
                    self.white_groups.clone(),
                    self.white_score.clone().unwrap(),
                    self.black_groups.clone(),
                    self.black_score.clone().unwrap(),
                ),
            };

            for g in players_groups.drain_filter(|group| group.has_liberty(point_id)) {
                group |= g
            }
            (players_groups, player_score, enemies_groups, enemies_score)
        };

        // 4. Removing dead enemies groups
        let are_there_dead_enemies_groups = {
            let new_score: usize = enemies_groups
                .drain_filter(|mut group| {
                    if group.has_liberty(point_id) && group.liberties_amount() == 1 {
                        group.refresh_liberties(&self.field);
                        group.liberties_amount() == 0
                    } else {
                        false
                    }
                })
                .map(|dead_group| dead_group.points_amount())
                .sum();

            // Increasing player's score
            player_score += new_score;

            new_score > 0
        };

        // 5. Post removing dead enemies groups actions
        if are_there_dead_enemies_groups {
            // Adding new group
            players_groups.push(group);

            // Refreshing liberties of all player's groups
            for group in players_groups.iter_mut() {
                group.refresh_liberties(&self.field)
            }
        } else {
            // Checking if this move is suicidal
            group.refresh_liberties(&self.field);
            if group.liberties_amount() == 0 {
                // Checking if suicide is permitted
                if self.rules.can_commit_suicide() {
                    // Increasing enemy's score
                    enemies_score += group.points_amount();

                    // Refreshing liberties of all player's groups
                    for group in enemies_groups.iter_mut() {
                        group.refresh_liberties(&self.field)
                    }
                } else {
                    return Err(GameError::SuicideMoveIsNotPermitted);
                }
            }
        }

        // 6. Blocking/unblocking points
        // TODO

        // 7. COMMIT transaction
        {
            // Setting original field to cloned groups
            // for collection in [&mut players_groups, &mut enemies_groups] {
            //     for group in collection {
            //         group.set_field(&self.field)
            //     }
            // }

            (
                self.black_groups,
                self.black_score,
                self.white_groups,
                self.white_score,
            ) = match player {
                PlayerColor::Black => (
                    players_groups,
                    Some(player_score),
                    enemies_groups,
                    Some(enemies_score),
                ),
                PlayerColor::White => (
                    enemies_groups,
                    Some(enemies_score),
                    players_groups,
                    Some(player_score),
                ),
            };

            self.field = cloned_field;
        }

        // 8. Increasing move number
        self.move_number = self.move_number.map(|n| n + 1);

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
