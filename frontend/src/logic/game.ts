export default interface Game {
	start(): void

	makeMove(pointID: number): Array<number>

	undoMove(): void

	get playerTurn(): any

	get whiteScore(): any

	get blackScore(): any

	get moveNumber(): any

	get blackStones(): any

	get whiteStones(): any
}
