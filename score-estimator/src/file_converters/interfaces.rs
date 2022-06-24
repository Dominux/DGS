use std::fs::File;
use std::io::prelude::*;

use regex::Regex;

use super::section::Section;
use crate::errors::{GameLoadingError, GameLoadingResult};

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
    fn _get_regex() -> Regex {
        Regex::new(r"^# (\S+)").unwrap()
    }

    fn to_sections(content: &str) -> GameLoadingResult<Vec<Section>> {
        let re = Self::_get_regex();

        // getting sections names
        let mut sections_names_iter = re.captures_iter(content).map(|cap| {
            cap.get(0)
                .map(|v| v.as_str().to_string())
                .ok_or(GameLoadingError::CannotReadSections)
        });

        // getting their content
        re.split(content)
            .skip(1) // Skipping the first occurancy cause it's not a section
            .map(|s| {
                sections_names_iter
                    .next()
                    .unwrap()
                    .map(|name| Section::new(name, s.to_string()))
            })
            .collect()
    }

    fn from_sections(sections: Vec<Section>) -> String {
        sections
            .into_iter()
            .map(|s| format!("# {}\n{}", s.name, s.content))
            .collect()
    }
}
