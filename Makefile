test:
	cd ./game_lib && cargo test && cd -

run_dev:
	cd ./frontend && npm run dev || true && cd -
