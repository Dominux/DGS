use entity::games::Model as Game;
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
pub struct CreateGameSchema {
    pub room_id: uuid::Uuid,
}

#[derive(Debug, Serialize)]
pub struct GameWithWSLink {
    game: Game,
    ws_link: String,
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
