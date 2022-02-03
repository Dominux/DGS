use std::io;
use std::fs::File;
use std::io::prelude::*;

/// Struct to load a game from desired file
pub struct GameLoader;

impl GameLoader {
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


#[derive(thiserror::Error, Debug)]
pub enum LoadingGameError {
	#[error("file does not exist")]
	FileNotFound(#[from] io::Error),
}

type GameLoadingResult<T> = Result<T, LoadingGameError>;
