FROM rustlang/rust:nightly

WORKDIR /server

# Creating dummy main.rs file
RUN mkdir ./src
RUN echo "fn main(){}" > ./src/main.rs

# Removing local packages from Cargo.toml
COPY ./server/Cargo.toml .
RUN sed -i "s/^\(\(entity = {\)\|\(migration = {\)\|\(spherical_go_game_lib = {\)\\).*//g" ./Cargo.toml

# Copying deps and downloading and pre-building them
RUN cargo build --tests

# Copying all the logic
COPY ./server .

COPY ../gamelib /gamelib
