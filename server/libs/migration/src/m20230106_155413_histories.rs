use sea_orm_migration::{
    prelude::*,
    sea_orm::{DeriveActiveEnum, EnumIter},
};
use serde::{Deserialize, Serialize};
use spherical_go_game_lib::FieldType as GameLibFieldType;

use crate::m20230103_213731_games::Game;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(History::Table)
                    .if_not_exists()
                    .col(ColumnDef::new(History::Id).uuid().not_null().primary_key())
                    .col(ColumnDef::new(History::GameId).uuid().not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-history-game-id")
                            .on_delete(ForeignKeyAction::Cascade)
                            .from_col(History::GameId)
                            .to(Game::Table, Game::Id),
                    )
                    .col(ColumnDef::new(History::Size).small_integer().not_null())
                    .col(
                        ColumnDef::new(History::FieldType)
                            .small_integer()
                            .not_null(),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(History::Table).to_owned())
            .await
    }
}

/// Learn more at https://docs.rs/sea-query#iden
#[derive(Iden)]
#[iden = "histories"]
pub enum History {
    Table,
    Id,
    #[iden = "game_id"]
    GameId,
    Size,
    #[iden = "field_type"]
    FieldType,
}

#[derive(Debug, Clone, PartialEq, EnumIter, DeriveActiveEnum, Eq, Serialize, Deserialize)]
#[sea_orm(rs_type = "i16", db_type = "SmallInteger")]
pub enum FieldType {
    #[sea_orm(num_value = 0)]
    Regular,
    #[sea_orm(num_value = 1)]
    GridSphere,
}

impl Into<GameLibFieldType> for FieldType {
    fn into(self) -> GameLibFieldType {
        match self {
            Self::Regular => GameLibFieldType::Regular,
            Self::GridSphere => GameLibFieldType::GridSphere,
        }
    }
}
