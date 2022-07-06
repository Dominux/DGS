#![feature(drain_filter)]
#![feature(slice_flatten)]

mod aliases;
mod errors;
mod field;
mod game;
mod group;
mod point;
mod rules;
mod state;

#[cfg(feature = "json")]
mod file_converters;

#[cfg(test)]
mod tests;
