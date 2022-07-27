use wasm_bindgen::prelude::*;

use spherical_go_game_lib::{Game as InnerGame, PointID, SizeType};

#[wasm_bindgen]
pub struct Game {
    inner: InnerGame,
}

type GameResult<T> = Result<T, JsError>;

#[wasm_bindgen]
impl Game {
    /// Create the game
    #[wasm_bindgen(constructor)]
    pub fn new(size: SizeType) -> GameResult<Game> {
        let inner = InnerGame::new(&size)?;
        Ok(Self { inner })
    }

    /// Make a move
    pub fn make_move(&mut self, point_id: PointID) -> GameResult<()> {
        self.inner.make_move(&point_id)?;
        Ok(())
    }

    /// Start game
    pub fn start(&mut self) -> GameResult<()> {
        self.inner.start()?;
        Ok(())
    }

    /// End game
    pub fn end(&mut self) -> GameResult<()> {
        self.inner.end()?;
        Ok(())
    }

    pub fn is_not_started(&self) -> bool {
        self.inner.is_not_started()
    }

    pub fn is_started(&self) -> bool {
        self.inner.is_started()
    }

    pub fn is_ended(&self) -> bool {
        self.inner.is_ended()
    }
}
