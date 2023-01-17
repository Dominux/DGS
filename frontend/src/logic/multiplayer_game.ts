import createLocalStore from '../../libs'
import api from '../api/index'
import WSClient from '../api/ws_client'
import FieldType from './fields/enum'
import Game from './game'
import { MoveResult, MoveSchema } from '../api/models'

export default class MultiplayerGame implements Game {
	private wsClient: WSClient | null = null
	private _moveNumber: number = 1
	private _blackStones: Array<number> = []
	private _whiteStones: Array<number> = []
	private _blackScore = 0
	private _whiteScore = 0

	constructor(public fieldType: FieldType, public size: number) {}

	async start() {
		const [store, setStore] = createLocalStore()

		if (store.room.game_id === null) {
			let room = store.room

			// Starting game
			try {
				const game_with_link = await api.startGame(
					store.room?.id,
					this.fieldType,
					this.size
				)
				room.game_id = game_with_link.game.id
			} catch (_) {
				room = await api.getRoom(store.room?.id)
			}

			setStore('room', room)
		}

		// Opening ws
		this.wsClient = new WSClient(
			`ws://localhost:8000/games/ws/${store.room.id}`,
			store.user
		)
	}

	async makeMove(pointID: number): Promise<number[]> {
		const [store, _setStore] = createLocalStore()

		// Sending message
		const move_schema: MoveSchema = {
			game_id: store.room.game_id,
			point_id: pointID,
		}
		this.wsClient?.sendMsg(JSON.stringify(move_schema))

		// Waiting for response from server
		const msg = await this.wsClient?.waitForMsg()

		const move_result = JSON.parse(msg)

		if (move_result.error !== undefined) {
			throw new Error(move_result.error)
		}

		// Making post move actions
		this.postMoveActions(move_result)

		return move_result.died_stones_ids
	}

	async waitForOpponentMove(): Promise<MoveResult> {
		const msg = await this.wsClient?.waitForMsg()
		const move_result: MoveResult = JSON.parse(msg)

		// Post move actions
		this.postMoveActions(move_result)

		return move_result
	}

	private postMoveActions(move_result: MoveResult) {
		if (this.playerTurn == 'Black') {
			this._blackStones.push(move_result.point_id)
			this._whiteStones = this._whiteStones.filter((p) =>
				move_result.died_stones_ids.includes(p)
			)
			this._blackScore += move_result.died_stones_ids.length
		} else {
			this._whiteStones.push(move_result.point_id)
			this._blackStones = this._whiteStones.filter((p) =>
				move_result.died_stones_ids.includes(p)
			)
			this._whiteScore += move_result.died_stones_ids.length
		}

		this._moveNumber++
	}

	undoMove(): void {
		throw new Error('Method not implemented.')
	}

	get playerTurn() {
		return this._moveNumber % 2 === 0 ? 'Black' : 'White'
	}
	get whiteScore(): any {
		return this._whiteScore
	}
	get blackScore(): any {
		return this._blackScore
	}
	get moveNumber(): any {
		return this._moveNumber
	}
	get blackStones(): any {
		return this._blackStones
	}
	get whiteStones(): any {
		return this._whiteStones
	}
}
