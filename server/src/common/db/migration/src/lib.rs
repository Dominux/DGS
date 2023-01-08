pub use sea_orm_migration::prelude::*;

mod m20220101_000001_create_table;
mod m20230103_213731_games;
mod m20230104_155530_rooms;
mod m20230106_155413_histories;

pub use m20230106_155413_histories::FieldType;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_create_table::Migration),
            Box::new(m20230103_213731_games::Migration),
            Box::new(m20230104_155530_rooms::Migration),
            Box::new(m20230106_155413_histories::Migration),
        ]
    }
}
