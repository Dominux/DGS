//! `SeaORM` Entity. Generated by sea-orm-codegen 0.10.6

use std::collections::HashSet;

use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};
use spherical_go_game_lib::{PointID, StoredGameMove, StoredGameMoveType};

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "history_records")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: Uuid,
    pub history_id: Uuid,
    pub move_number: i32,
    pub point_id: i32,
    pub died_points_ids: Vec<i32>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::histories::Entity",
        from = "Column::HistoryId",
        to = "super::histories::Column::Id",
        on_update = "NoAction",
        on_delete = "Cascade"
    )]
    Histories,
}

impl Related<super::histories::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Histories.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}

impl Into<StoredGameMove> for Model {
    fn into(self) -> StoredGameMove {
        // TODO: update logic once you add other move types to the db table
        StoredGameMove {
            move_type: StoredGameMoveType::Move,
            point_id: Some(self.point_id as PointID),
            died: HashSet::from_iter(self.died_points_ids.into_iter().map(|p| p as PointID)),
        }
    }
}
