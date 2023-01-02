FROM rust:1.66

WORKDIR /app

# Creating dummy main.rs file
RUN mkdir ./src
RUN echo "fn main(){}" > ./src/main.rs

# Removing local packages from Cargo.toml
COPY ./app/Cargo.toml .
RUN sed -i "s/^\(\(entity = {\)\|\(migration = {\)\).*//g" ./Cargo.toml

# Copying deps and downloading and pre-building them
RUN cargo build --tests

# Copying all the logic
COPY ./app .
