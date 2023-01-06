use entity::games::Model as Game;
use migration::FieldType;
use serde::{Deserialize, Serialize};
use spherical_go_game_lib::SizeType;

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
        String::from("ws://lmao")
    }
}

impl From<Game> for GameWithWSLink {
    fn from(game: Game) -> Self {
        let ws_link = Self::get_ws_link(&game);
        Self { game, ws_link }
    }
}
