use std::fs::File;
use std::io::prelude::*;

use crate::errors::GameLoadingResult;

use super::section::Section;

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

/// This logic just converts string to sections and vice versa
pub trait SectionConverter {
    fn to_sections(content: String) -> GameLoadingResult<Vec<Section>> {
        todo!()
    }

    fn from_sections(sections: Vec<Section>) -> String {
        todo!()
    }
}
