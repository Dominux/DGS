use std::fs::File;
use std::io::prelude::*;

use super::errors::GameLoadingResult;

/// Struct to convert a game to/from file
pub struct FileConverter;

impl FileConverter {
    pub fn new() -> Self {
        Self {}
    }

    pub fn load(&self, filepath: &str) -> GameLoadingResult<()> {
        let file_content = self.read_file(filepath)?;
        Ok(())
    }

    fn read_file(&self, filepath: &str) -> GameLoadingResult<String> {
        let mut file = File::open(filepath)?;
        let mut content = String::new();
        file.read_to_string(&mut content)?;
        Ok(content)
    }
}
