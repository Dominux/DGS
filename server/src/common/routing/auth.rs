use axum::http::{request::Parts, StatusCode};
use axum::{async_trait, extract::FromRequestParts};

use crate::common::errors::{DGSError, DGSResult};

#[derive(Debug, Clone)]
pub struct AuthenticatedUser {
    pub user_id: uuid::Uuid,
    pub secure_id: uuid::Uuid,
}

impl AuthenticatedUser {
    fn decode_request_parts(req: &mut Parts) -> DGSResult<Self> {
        // Get authorization header
        let authorization = Self::get_header(req)?;
        Self::decode_token(authorization)
    }

    pub fn decode_token(token: &str) -> DGSResult<Self> {
        let (user_id, secure_id) = token.split_once(':').ok_or(DGSError::TokenDecodingError)?;
        let user_id = uuid::Uuid::parse_str(user_id).map_err(|_| DGSError::TokenDecodingError)?;
        let secure_id =
            uuid::Uuid::parse_str(secure_id).map_err(|_| DGSError::TokenDecodingError)?;

        Ok(Self { user_id, secure_id })
    }

    fn get_header(parts: &mut Parts) -> DGSResult<&str> {
        Ok(parts
            .headers
            .get("AUTHORIZATION")
            .ok_or(DGSError::TokenDecodingError)?
            .to_str()
            .map_err(|_| DGSError::TokenDecodingError)?)
    }
}

#[async_trait]
impl<S> FromRequestParts<S> for AuthenticatedUser
where
    S: Send + Sync,
{
    type Rejection = (StatusCode, String);

    async fn from_request_parts(parts: &mut Parts, _: &S) -> Result<Self, Self::Rejection> {
        Ok(Self::decode_request_parts(parts)?)
    }
}
