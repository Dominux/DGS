use sea_orm_migration::prelude::*;

use crate::m20230106_155413_histories::History;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(HistoryRecord::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(HistoryRecord::Id)
                            .uuid()
                            .not_null()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(HistoryRecord::HistoryID).uuid().not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-history_record-history-id")
                            .on_delete(ForeignKeyAction::Cascade)
                            .from_col(HistoryRecord::HistoryID)
                            .to(History::Table, History::Id),
                    )
                    .col(
                        ColumnDef::new(HistoryRecord::MoveNumber)
                            .integer()
                            .not_null(),
                    )
                    .col(ColumnDef::new(HistoryRecord::PointID).integer().not_null())
                    .col(
                        ColumnDef::new(HistoryRecord::DiedPointsIds)
                            .array(ColumnType::Integer(None))
                            .not_null(),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(HistoryRecord::Table).to_owned())
            .await
    }
}

/// Learn more at https://docs.rs/sea-query#iden
#[derive(Iden)]
#[iden = "history_records"]
enum HistoryRecord {
    Table,
    Id,
    #[iden = "history_id"]
    HistoryID,
    #[iden = "move_number"]
    MoveNumber,
    #[iden = "point_id"]
    PointID,
    #[iden = "died_points_ids"]
    DiedPointsIds,
}
