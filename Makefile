test_gamelib:
	cd ./gamelib && cargo test && cd -

compile_gamelib_to_wasm:
	cd ./wasm &&\
	wasm-pack build --target web || true &&\
	rm -r ../frontend/src/pkg || true &&\
	mv pkg ../frontend/src &&\
	cd -

pnpm_i:
	cd ./frontend && pnpm i || true && cd -

run_dev:
	cd ./frontend && pnpm run dev || true && cd -

front_build:
	cd ./frontend && pnpm run build || true && cd -

test_server:
	cp .test.env .env &&\
	docker compose -f docker-compose.test.yml down &&\
	docker compose -f docker-compose.test.yml build &&\
	docker compose -f docker-compose.test.yml run server

run_server:
	cp .dev.env .env &&\
	docker compose -f docker-compose.dev.yml down &&\
	docker compose -f docker-compose.dev.yml up --build --force-recreate

deploy:
	git branch -D gh-pages || true &&\
	git checkout -b gh-pages &&\
	make compile_gamelib_to_wasm &&\
	make pnpm_i &&\
	make front_build &&\
	mv ./frontend/dist/* ./ &&\
	rm -rf ./frontend &&\
	find . -not \( -wholename './.git/*' -or -name 'index.html' -or -wholename './assets/*' \) -delete || true &&\
	sed -i "s/href=\"\//href=\"/g" ./index.html &&\
	sed -i "s/src=\"\//src=\"/g" ./index.html &&\
	sed -i "s/URL(\"\/assets/URL(\"assets/g" ./assets/*.js &&\
	git add --all &&\
	git commit -m "lol" &&\
	git push -f -u origin gh-pages &&\
	git checkout - &&\
	make pnpm_i &&\
	make compile_gamelib_to_wasm

