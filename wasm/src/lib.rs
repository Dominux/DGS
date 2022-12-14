use wasm_bindgen::prelude::*;

use spherical_go_game_lib::{
    FieldType as InnerFieldType, Game as InnerGame, PlayerColor, PointID, SizeType,
};

type GameResult<T> = Result<T, JsError>;

#[wasm_bindgen]
#[derive(Debug, Clone, Copy)]
pub enum Player {
    Black = "Black",
    White = "White",
}

impl From<PlayerColor> for Player {
    fn from(p: PlayerColor) -> Self {
        match p {
            PlayerColor::Black => Self::Black,
            PlayerColor::White => Self::White,
        }
    }
}

#[wasm_bindgen]
#[derive(Debug, Clone, Copy)]
pub enum FieldType {
    Regular = "Regular",
    CubicSphere = "CubicSphere ",
    GridSphere = "GridSphere",
}

impl From<FieldType> for InnerFieldType {
    fn from(f: FieldType) -> Self {
        match f {
            FieldType::Regular => Self::Regular,
            FieldType::GridSphere => Self::GridSphere,
            FieldType::CubicSphere => Self::CubicSphere,
            _ => panic!("Wrong variant for a field"),
        }
    }
}

impl From<InnerFieldType> for FieldType {
    fn from(f: InnerFieldType) -> Self {
        match f {
            InnerFieldType::Regular => Self::Regular,
            InnerFieldType::GridSphere => Self::GridSphere,
            InnerFieldType::CubicSphere => Self::CubicSphere,
        }
    }
}

#[wasm_bindgen]
pub struct Game {
    inner: InnerGame,
}

#[wasm_bindgen]
impl Game {
    /// Create the game
    #[wasm_bindgen(constructor)]
    pub fn new(field_type: FieldType, size: SizeType, use_history: bool) -> GameResult<Game> {
        let inner = InnerGame::new(field_type.into(), &size, use_history)?;
        Ok(Self { inner })
    }

    /// Make a move
    pub fn make_move(&mut self, point_id: PointID) -> GameResult<Vec<PointID>> {
        let deadlist = self.inner.make_move(&point_id)?;
        Ok(deadlist.into_iter().collect())
    }

    // Undo previous move
    pub fn undo_move(&mut self) -> GameResult<()> {
        self.inner.undo_move()?;
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

    pub fn get_black_stones(&self) -> Vec<PointID> {
        self.inner.get_black_stones()
    }

    pub fn get_white_stones(&self) -> Vec<PointID> {
        self.inner.get_white_stones()
    }

    pub fn get_black_score(&self) -> Option<usize> {
        self.inner.get_black_score()
    }

    pub fn get_white_score(&self) -> Option<usize> {
        self.inner.get_white_score()
    }

    pub fn player_turn(&self) -> Option<Player> {
        self.inner.player_turn().map(|p| Player::from(p))
    }

    pub fn field_type(&self) -> FieldType {
        self.inner.field_type().into()
    }
}
