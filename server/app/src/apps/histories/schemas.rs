use migration::FieldType;
use spherical_go_game_lib::SizeType;

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
