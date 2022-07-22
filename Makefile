test:
	cd ./game_lib && cargo test && cd -

run_dev:
	cd ./frontend && pnpm run dev || true && cd -
