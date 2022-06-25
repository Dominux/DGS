use serde::{Deserialize, Serialize};

use crate::coordinates::Coordinates;

///
/// Consider a stored game to be like this:
///
/// ```
/// {
/// 	"meta": {
/// 		"field": "cube_sphere",
/// 		"size": 9
/// 	},
/// 	"moves": [
/// 		{
/// 			"moveType": "Move",
/// 			"coordinates": {
/// 				"x": 0,
/// 				"y": 0
/// 			}
/// 		},
/// 		{
/// 			"moveType": "Move",
/// 			"coordinates": {
/// 				"x": 7,
/// 				"y": 19
/// 			}
/// 		},
/// 		{
/// 			"moveType": "Pass",
/// 		},
///         ...
/// 	]
/// }
/// ```
///
#[derive(Debug, Deserialize, Serialize)]
pub struct StoredGame<T> {
    pub meta: StoredGameMeta,
    pub moves: Vec<StoredGameMove<T>>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct StoredGameMeta {
    pub field: String,
    pub size: usize,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct StoredGameMove<T> {
    pub move_type: StoredGameMoveType,

    #[serde(default = "Option::default")]
    pub coordinates: Option<Coordinates<T>>,
}

#[derive(Debug, Deserialize, Serialize)]
pub enum StoredGameMoveType {
    Move,
    Pass,
    Surrender,
}
