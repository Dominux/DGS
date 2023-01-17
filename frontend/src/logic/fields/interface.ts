import { MoveResult } from '../../api/models'
import Game from '../game'
import StoneManager, { CreateStoneScheme } from '../stone_manager'

export interface Field {
	game: Game | undefined

	init(scene: BABYLON.Scene, gridSize: number): Promise<Field>

	start(
		game: Game,
		onEndMove: Function,
		onDeath: Function,
		onError: Function
	): Promise<void>

	get playerTurn(): string
	get blackScore(): number
	get whiteScore(): number

	makeMoveProgramatically(move_result: MoveResult): void
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
