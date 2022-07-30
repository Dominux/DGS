test:
	cd ./gamelib && cargo test && cd -

compile_gamelib_to_wasm:
	cd ./wasm &&\
	wasm-pack build --target web || true &&\
	mv pkg ../frontend/src &&\
	cd -

run_dev:
	cd ./frontend && pnpm run dev || true && cd -

front_build:
	cd ./frontend && pnpm run build || true && cd -

pnpm_i:
	cd ./frontend && pnpm i || true && cd -
