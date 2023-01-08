use entity::{histories, history_records};
use migration::FieldType;
use spherical_go_game_lib::{SizeType, StoredGame};

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
