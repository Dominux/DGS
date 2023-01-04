use sea_orm_migration::prelude::*;

use crate::{m20220101_000001_create_table::User, m20230103_213731_games::Game};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Room::Table)
                    .if_not_exists()
                    .col(ColumnDef::new(Room::Id).uuid().not_null().primary_key())
                    .col(ColumnDef::new(Room::Player1Id).uuid().not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-room-player1-id")
                            .from_col(Room::Player1Id)
                            .to(User::Table, User::Id),
                    )
                    .col(ColumnDef::new(Room::Player2Id).uuid().not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-room-player2-id")
                            .from_col(Room::Player2Id)
                            .to(User::Table, User::Id),
                    )
                    .col(ColumnDef::new(Room::GameId).uuid())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-room-game-id")
                            .from_col(Room::GameId)
                            .to(Game::Table, Game::Id),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Room::Table).to_owned())
            .await
    }
}

/// Learn more at https://docs.rs/sea-query#iden
#[derive(Iden)]
#[iden = "rooms"]
enum Room {
    Table,
    Id,

    #[iden = "player1_id"]
    Player1Id,

    #[iden = "player2_id"]
    Player2Id,

    #[iden = "game_id"]
    GameId,
}
