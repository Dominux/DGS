# Building
FROM rustlang/rust:nightly AS builder

WORKDIR /app

# Creating dummy main.rs file
RUN mkdir ./src
RUN echo "fn main(){}" > ./src/main.rs

# Removing local packages from Cargo.toml
COPY ./server/Cargo.toml .
RUN sed -i "s/^\(\(entity = {\)\|\(migration = {\)\|\(spherical_go_game_lib = {\)\\).*//g" ./Cargo.toml

# Copying deps and downloading and pre-building them
RUN cargo build

# Copying all the logic
COPY ../gamelib /gamelib
COPY ./server .

RUN cargo build

# Running
FROM debian:11-slim AS runtime
COPY --from=builder /app/target/debug/server /dgs_server
ENTRYPOINT [ "./dgs_server" ]
