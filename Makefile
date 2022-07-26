test:
	cd ./game_lib && cargo test && cd -

compile_gamelib_to_wasm:
	cd ./game_lib &&\
	rustup target add wasm32-unknown-unknown || true &&\
	cargo build --target wasm32-unknown-unknown --release || true &&\
	cd - &&\
	echo "Check out the target/release directory"

run_dev:
	cd ./frontend && pnpm run dev || true && cd -

front_build:
	cd ./frontend && pnpm run build || true && cd -
