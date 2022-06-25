use std::fs::File;
use std::io::prelude::*;

use crate::errors::GameLoadingResult;

use super::models::StoredGame;

/// This logic just reads/writes to/from file
pub trait FileConverter {
    fn load(filepath: &str) -> GameLoadingResult<String> {
        let mut file = File::open(filepath)?;
        let mut content = String::new();
        file.read_to_string(&mut content)?;
        Ok(content)
    }

    fn save(filepath: &str, content: String) -> GameLoadingResult<()> {
        let mut file = File::open(filepath)?;
        file.write(content.as_bytes())?;
        Ok(())
    }
}

pub trait JSONizer {
    fn deserialize(json: &str) -> serde_json::Result<StoredGame> {
        serde_json::from_str(json)
    }

    fn serialize(game: &StoredGame) -> serde_json::Result<String> {
        serde_json::to_string(game)
    }
}
