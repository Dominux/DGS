import GameGUI from '../gui'
import FieldType, { getFieldFromType } from './fields/enum'
import { Field } from './fields/interface'
import Game from './game'
import Scene from './scene'

export default class GameManager {
	readonly _scene: Scene
	readonly _GUI: GameGUI

	protected fieldType: FieldType = FieldType.GridSphere
	protected gridSize: number = 9

	protected field?: Field
	protected isStarted: boolean = false

	constructor(
		canvas: HTMLCanvasElement,
		sphereRadius: number,
		readonly gameKlass: { new (): Game }
	) {
		this._scene = new Scene(canvas, sphereRadius)

		const onChangeFieldType = (newVal: FieldType) => {
			this.fieldType = newVal
			this.setField()
		}
		const onChangeGridSize = (newVal: number) => {
			this.gridSize = newVal
			this.setField()
		}
		const onSumbit = () => this.gameStart()
		const onUndo = () => this.undo()

		this._GUI = new GameGUI(
			this._scene._camera,
			onChangeFieldType,
			onChangeGridSize,
			this.fieldType,
			this.gridSize,
			onSumbit,
			onUndo
		)

		// Setting field
		this.setField()
	}

	showGUI() {
		this._GUI.show()
	}
	hideGUI() {
		this._GUI.hide()
	}

	setField() {
		const klass = getFieldFromType(this.fieldType)

		// Deleting old field
		this.field?.delete()

		// Creating a new one
		this.field = new klass(this._scene._scene, this.gridSize)
	}

	gameStart() {
		this.isStarted = true

		// Starting game
		const game = new this.gameKlass(this.fieldType, this.gridSize)
		this.field?.start(
			game,
			() => this.onEndMove(),
			() => this.onDeath(),
			(errorMsg: string) => this._GUI.onError(errorMsg)
		)

		this._GUI.onStart()

		// Setting initial score
		this.setBlackScore(game.blackScore)
		this.setWhiteScore(game.whiteScore)
	}

	undo() {
		this.field?.undoMove()

		this.setBlackScore(this.field?.blackScore)
		this.setWhiteScore(this.field?.whiteScore)
		this.setIsUndoMoveDisabled()
	}

	setIsUndoMoveDisabled() {
		this._GUI.isUndoButtonHidden = this.field?.game?.moveNumber <= 1
	}

	setBlackScore(value: number) {
		this._GUI.setBlackScore(value)
	}

	setWhiteScore(value: number) {
		this._GUI.setWhiteScore(value)
	}

	onEndMove() {
		this.setIsUndoMoveDisabled()
	}

	onDeath() {
		if (this.field?.game?.playerTurn.toLowerCase() === 'white') {
			this.setBlackScore(this.field?.blackScore)
		} else {
			this.setWhiteScore(this.field?.whiteScore)
		}
	}
}
