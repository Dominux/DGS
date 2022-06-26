use serde::{Deserialize, Serialize};

use crate::point::PointID;

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
pub struct StoredGame {
    pub meta: StoredGameMeta,
    pub moves: Vec<StoredGameMove>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct StoredGameMeta {
    pub field: String,
    pub size: usize,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct StoredGameMove {
    pub move_type: StoredGameMoveType,

    #[serde(default = "Option::default")]
    pub coordinates: Option<PointID>,
}

#[derive(Debug, Deserialize, Serialize)]
pub enum StoredGameMoveType {
    Move,
    Pass,
    Surrender,
}
