import init, { Game as GameLib } from '../pkg/wasm_gamelib'
import FieldType from './fields/enum'

await init()

export default class Game {
	protected inner: GameLib

	constructor(size: number, fieldType: FieldType) {
		this.inner = new GameLib(fieldType, size, true)
	}

	start() {
		this.inner.start()
	}

	makeMove(pointID: number): Array<number> {
		return [...this.inner.make_move(pointID)]
	}

	undoMove() {
		return this.inner.undo_move()
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

	get moveNumber() {
		return this.inner.get_move_number()
	}
}
