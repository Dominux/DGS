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

	constructor(canvas: HTMLCanvasElement, sphereRadius: number) {
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

		this._GUI = new GameGUI(
			this._scene._camera,
			onChangeFieldType,
			onChangeGridSize,
			this.fieldType,
			this.gridSize,
			onSumbit
		)

		// Setting field
		this.setField()
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
		const game = new Game(this.gridSize, this.fieldType)
		this.field?.start(game, this.onEndMove, this.onDeath, this.onError)
	}

	onEndMove() {}
	onDeath() {}
	onError() {}
}
