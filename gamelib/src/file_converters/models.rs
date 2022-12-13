use serde::{Deserialize, Serialize};

use crate::aliases::PointID;

///
/// Consider a stored game to be like this:
///
/// ```jsonc
/// {
/// 	"meta": {
/// 		"field": "cube_sphere",
/// 		"size": 9
/// 	},
/// 	"moves": [
/// 		{
/// 			"moveType": "Move",
///             "pointID": 69420,
/// 		},
/// 		{
/// 			"moveType": "Move",
///             "pointID": 228,
/// 		},
/// 		{
/// 			"moveType": "Pass",
/// 		},
///         ...
/// 	]
/// }
/// ```
///
#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct StoredGame {
    pub meta: StoredGameMeta,
    pub moves: Vec<StoredGameMove>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct StoredGameMeta {
    pub field: String,
    pub size: usize,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct StoredGameMove {
    pub move_type: StoredGameMoveType,

    #[serde(default = "Option::default")]
    pub pointID: Option<PointID>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub enum StoredGameMoveType {
    Move,
    Pass,
    Surrender,
}
