import Game from '../game'

export interface Field {
	start(
		game: Game,
		onEndMove: Function,
		onDeath: Function,
		onError: Function
	): void
}
