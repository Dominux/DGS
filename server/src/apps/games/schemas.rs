use std::collections::HashSet;

use entity::games::Model as Game;
use migration::FieldType;
use serde::{Deserialize, Serialize};
use spherical_go_game_lib::{PointID, SizeType};
use tokio::sync::broadcast;

use crate::apps::users::schemas::OutUserSchema;

#[derive(Debug, Deserialize)]
pub struct CreateGameSchema {
    pub room_id: uuid::Uuid,
    pub field_type: FieldType,
    pub size: SizeType,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GameWithWSLink {
    pub game: Game,
    pub ws_link: String,
}

impl GameWithWSLink {
    pub fn get_ws_link(game: &Game) -> String {
        format!("ws://{}", game.id)
    }
}

impl From<Game> for GameWithWSLink {
    fn from(game: Game) -> Self {
        let ws_link = Self::get_ws_link(&game);
        Self { game, ws_link }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct MoveSchema {
    pub game_id: uuid::Uuid,
    pub point_id: PointID,
}

#[derive(Debug, Clone)]
pub struct RoomState {
    pub room_id: uuid::Uuid,
    pub black_player: OutUserSchema,
    pub white_player: OutUserSchema,
    pub tx: broadcast::Sender<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MoveWithResult {
    pub point_id: PointID,
    pub died_stones_ids: HashSet<PointID>,
}

impl MoveWithResult {
    pub fn new(point_id: PointID, died_stones_ids: HashSet<PointID>) -> Self {
        Self {
            point_id,
            died_stones_ids,
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct WSError {
    pub error: String,
}

impl WSError {
    pub fn new(e: String) -> Self {
        Self { error: e }
    }
}
