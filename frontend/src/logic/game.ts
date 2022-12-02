import init, { Game as GameLib } from '../pkg/wasm_gamelib'

await init()

export default class Game {
	protected inner: GameLib

	constructor(size: number) {
		this.inner = new GameLib('GridSphere', size)
	}

	start() {
		this.inner.start()
	}

	makeMove(pointID: number): Array<number> {
		return [...this.inner.make_move(pointID)]
	}

	get playerTurn() {
		return this.inner.player_turn()
	}

	get whiteScore() {
		return this.inner.get_white_score()
	}

	get blackScore() {
		return this.inner.get_black_score()
	}
}
