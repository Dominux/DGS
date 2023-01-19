import { MoveResult } from '../../api/models'
import Game from '../games/game'
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

	makeMoveProgramatically(moveResult: MoveResult): void
	putStoneProgramatically(
		moveResult: MoveResult,
		color: 'Black' | 'White'
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
