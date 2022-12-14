import Game from '../game'
import StoneManager from '../stone_manager'

export interface Field {
	game: Game | undefined

	start(
		game: Game,
		onEndMove: Function,
		onDeath: Function,
		onError: Function
	): void

	undoMove(): void
}

export function returnStonesBack(
	stoneManager: StoneManager
	// blackStones: Array<number>,
	// whiteStones: Array<number>
): void {
	stoneManager.clear()
}
