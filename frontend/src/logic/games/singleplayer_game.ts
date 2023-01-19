import Game from './game'
import init, { Game as GameLib } from '../../pkg/wasm_gamelib'
import FieldType from '../fields/enum'

await init()

export default class SingleplayerGame implements Game {
	protected inner: GameLib

	constructor(fieldType: FieldType, size: number, _onRecreateGame: Function) {
		this.inner = new GameLib(fieldType, size, true)
	}

	async start() {
		this.inner.start()
	}

	async makeMove(pointID: number): Promise<Array<number>> {
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

	get blackStones() {
		return [...this.inner.get_black_stones()]
	}

	get whiteStones() {
		return [...this.inner.get_white_stones()]
	}
}
