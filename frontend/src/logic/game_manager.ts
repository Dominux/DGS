import createLocalStore from '../../libs'
import { EnvTexture } from '../constants'
import GameGUI from '../gui'
import FieldType, { getFieldFromType } from './fields/enum'
import { Field } from './fields/interface'
import Game from './games/game'
import Scene from './scene'

export default class GameManager {
	readonly _scene: Scene
	readonly _GUI: GameGUI

	fieldType: FieldType = FieldType.GridSphere
	gridSize: number = 9

	protected field?: Field
	protected isStarted: boolean = false
	protected isMultiplayer: boolean

	constructor(
		canvas: HTMLCanvasElement,
		sphereRadius: number,
		readonly gameKlass: { new (): Game }
	) {
		this._scene = new Scene(canvas, sphereRadius)

		const onChangeFieldType = async (newVal: FieldType) => {
			this.fieldType = newVal
			await this.setField()
		}
		const onChangeGridSize = async (newVal: number) => {
			this.gridSize = newVal
			await this.setField()
		}
		const onSumbit = async () => await this.gameStart()
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
	}

	showGUI() {
		this._GUI.show()
	}
	hideGUI() {
		this._GUI.hide()
	}

	async setField() {
		const klass = getFieldFromType(this.fieldType)

		// Deleting old field
		this.field?.delete()

		// Creating a new one
		this.field = await klass.init(this._scene._scene, this.gridSize)
	}

	async gameStart() {
		const [store, _setStore] = createLocalStore()

		this.isStarted = true

		// Starting game
		const game = new this.gameKlass(
			this.fieldType,
			this.gridSize,
			(blackStones, whiteStones) =>
				this.onRecreateGame(blackStones, whiteStones)
		)

		await this.field?.start(
			game,
			() => this.onEndMove(),
			() => this.onDeath(),
			(errorMsg: string) => this._GUI.onError(errorMsg)
		)

		this.isMultiplayer = game.wsClient

		this._GUI.onStart()

		// Setting initial score
		this.setBlackScore(game.blackScore)
		this.setWhiteScore(game.whiteScore)

		// if it's multiplayer and it's not player's turn
		if (
			this.isMultiplayer &&
			((store.room.player2_id === store.user.id &&
				store.game?.history?.records.length % 2 === 0) ||
				(store.room.player1_id === store.user.id &&
					store.game?.history?.records.length % 2 === 1))
		) {
			this.field.canMove = false

			const moveResult = await game.waitForOpponentMove()
			this.field?.makeMoveProgramatically(moveResult)

			this.field.canMove = true
		}
	}

	undo() {
		this.field?.undoMove()

		this.setBlackScore(this.field?.blackScore)
		this.setWhiteScore(this.field?.whiteScore)
		this.setIsUndoMoveDisabled()
	}

	onRecreateGame(blackStones: Array<number>, whiteStones: Array<number>) {
		// Putting stones
		for (const [stones, color] of [
			[blackStones, 'Black'],
			[whiteStones, 'White'],
		]) {
			for (const stone of stones) {
				const moveResult = {
					point_id: stone,
					died_stones_ids: [],
				}
				this.field?.putStoneProgramatically(moveResult, color)
			}
		}
	}

	setIsUndoMoveDisabled() {
		this._GUI.isUndoButtonHidden =
			this.isMultiplayer || this.field?.game?.moveNumber <= 1
	}

	setEnvTexture(envTexture: EnvTexture) {
		this._scene.setEnv(envTexture)
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
		if (
			this.field.game.playerTurn.toLowerCase() ===
			(this.isMultiplayer ? 'black' : 'white')
		) {
			this.setBlackScore(this.field?.blackScore)
		} else {
			this.setWhiteScore(this.field?.whiteScore)
		}
	}
}
