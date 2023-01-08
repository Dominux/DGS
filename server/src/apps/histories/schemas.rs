use std::collections::HashSet;

use entity::{histories, history_records};
use migration::FieldType;
use serde::Serialize;
use spherical_go_game_lib::{PointID, SizeType, StoredGame};

#[derive(Debug)]
pub struct CreateHistorySchema {
    pub game_id: uuid::Uuid,
    pub field_type: FieldType,
    pub size: SizeType,
}

impl CreateHistorySchema {
    pub fn new(game_id: uuid::Uuid, field_type: FieldType, size: SizeType) -> Self {
        Self {
            game_id,
            field_type,
            size,
        }
    }
}

#[derive(Debug)]
pub struct CreateHistoryRecordSchema {
    pub history_id: uuid::Uuid,
    pub move_number: usize,
    pub point_id: PointID,
    pub died_stones_ids: HashSet<PointID>,
}

impl CreateHistoryRecordSchema {
    pub fn new(
        history_id: uuid::Uuid,
        move_number: usize,
        point_id: PointID,
        died_stones_ids: HashSet<PointID>,
    ) -> Self {
        Self {
            history_id,
            move_number,
            point_id,
            died_stones_ids,
        }
    }
}

#[derive(Debug)]
pub struct HistoryWithRecords {
    pub history: histories::Model,
    pub records: Vec<history_records::Model>,
}

impl Into<StoredGame> for HistoryWithRecords {
    fn into(self) -> StoredGame {
        StoredGame {
            meta: self.history.into(),
            moves: self.records.into_iter().map(|rec| rec.into()).collect(),
        }
    }
}

#[derive(Debug, Serialize)]
pub struct MoveResult {
    pub died_stones_ids: HashSet<PointID>,
}

impl MoveResult {
    pub fn new(died_stones_ids: HashSet<PointID>) -> Self {
        Self { died_stones_ids }
    }
}
