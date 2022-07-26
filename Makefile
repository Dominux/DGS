test:
	cd ./game_lib && cargo test && cd -

run_dev:
	cd ./frontend && pnpm run dev || true && cd -

front_build:
	cd ./frontend && pnpm run build || true && cd -
