use std::{env, str::FromStr};

use super::errors::{DGSError, DGSResult};

#[derive(Debug, Clone)]
pub struct Config {
    pub db_uri: String,
    pub port: u16,
}

impl Config {
    pub fn new() -> DGSResult<Self> {
        let db_uri = Self::get_env_var("DATABASE_URL")?;
        let port = Self::get_env_var("PORT")?;

        Ok(Self { db_uri, port })
    }

    #[inline]
    fn get_env_var<T: FromStr>(env_var: &str) -> DGSResult<T> {
        env::var(env_var)
            .map_err(|_| DGSError::EnvConfigLoadingError(env_var.to_owned()))?
            .parse::<T>()
            .map_err(|_| DGSError::EnvVarParsingError(env_var.to_owned()))
    }
}
