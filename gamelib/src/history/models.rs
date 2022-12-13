use std::collections::HashSet;

use serde::{Deserialize, Serialize};

use crate::{aliases::PointID, FieldType, SizeType};

///
/// Consider a stored game to be like this:
///
/// ```jsonc
/// {
/// 	"meta": {
/// 		"field_type": "GridSphere",
/// 		"size": 9
/// 	},
/// 	"moves": [
/// 		{
/// 			"moveType": "Move",
///             "pointID": 69420,
///             "died": [5, 78]
/// 		},
/// 		{
/// 			"moveType": "Move",
///             "pointID": 228,
///             "blocked": [34]
/// 		},
/// 		{
/// 			"moveType": "Pass",
/// 		},
/// 		{
/// 			"moveType": "Move",
///             "pointID": 1337,
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
    pub field_type: FieldType,
    pub size: SizeType,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct StoredGameMove {
    pub move_type: StoredGameMoveType,

    #[serde(default = "Option::default")]
    pub point_id: Option<PointID>,

    #[serde(default = "HashSet::default")]
    pub died: HashSet<PointID>,

    #[serde(default = "HashSet::default")]
    pub blocked: HashSet<PointID>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub enum StoredGameMoveType {
    Move,
    Pass,
    Surrender,
}
