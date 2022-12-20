import Game from '../game'
import StoneManager, { CreateStoneScheme } from '../stone_manager'

export interface Field {
	game: Game | undefined

	start(
		game: Game,
		onEndMove: Function,
		onDeath: Function,
		onError: Function
	): void

	undoMove(): void
	getCreateStoneSchema(id: number, color: BABYLON.Color3): CreateStoneScheme
	delete(): void
}

export function returnStonesBack(
	stoneManager: StoneManager,
	stones: Array<CreateStoneScheme>
): void {
	stoneManager.clear()

	for (const stone of stones) {
		stoneManager.create(stone)
	}
}
