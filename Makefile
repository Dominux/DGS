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
	rm .env Dockerfile docker-compose.yml || true &&\
	cp ./deploy/test/* . &&\
	cp ./deploy/test/.env . &&\
	docker compose down &&\
	docker compose build &&\
	docker compose run server

run_prod:
	rm .env Dockerfile docker-compose.yml || true &&\
	cp ./deploy/prod/* . &&\
	cp ./deploy/prod/.env . &&\
	mkdir -p ./volumes/postgres_data &&\
	docker compose down --remove-orphans &&\
	docker compose up -d --build --force-recreate

run_server:
	rm .env Dockerfile docker-compose.yml || true &&\
	cp ./deploy/dev/* . &&\
	cp ./deploy/dev/.env . &&\
	mkdir -p ./volumes/postgres_data &&\
	docker compose down --remove-orphans &&\
	docker compose up -d --build --force-recreate

deploy_front:
	git branch -D gh-pages || true &&\
	git checkout -b gh-pages &&\
	make compile_gamelib_to_wasm &&\
	make pnpm_i &&\
	make front_build &&\
	mv ./frontend/dist/* ./ &&\
	mv ./frontend/404.html ./ &&\
	rm -rf ./frontend &&\
	find . -not \( -wholename './.git/*' -or -name 'index.html' -or -wholename './assets/*' -or -name '404.html' \) -delete || true &&\
	git add --all &&\
	git commit -m "lol" &&\
	git push -f -u origin gh-pages &&\
	git checkout - &&\
	make pnpm_i &&\
	make compile_gamelib_to_wasm

