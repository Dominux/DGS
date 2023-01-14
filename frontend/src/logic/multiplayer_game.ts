import createLocalStore from '../../libs'
import api from '../api/index'
import WSClient from '../api/ws_client'
import FieldType from './fields/enum'
import Game from './game'
import { MoveResult, MoveSchema } from '../api/models'
import { MOVE_RESULT_CHECK_INTERVAL_MS } from '../constants'

export default class MultiplayerGame implements Game {
	private wsClient: WSClient | null = null

	constructor(public fieldType: FieldType, public size: number) {}

	async start() {
		const [store, setStore] = createLocalStore()

		if (store.room.game_id === null) {
			// Starting game
			const game_with_link = await api.startGame(
				store.room?.id,
				this.fieldType,
				this.size
			)

			// Updating room
			const room = store.room
			room.game_id = game_with_link.game.id
			setStore('room', room)
		}

		// Opening ws
		this.wsClient = new WSClient(
			`ws://localhost:8000/games/ws/${store.room.id}`,
			store.user,
			(msg: string) => console.log(msg)
		)
	}

	async makeMove(pointID: number): number[] {
		const [store, _setStore] = createLocalStore()

		// Sending message
		const move_schema: MoveSchema = {
			game_id: store.room.game_id,
			point_id: pointID,
		}
		this.wsClient?.sendMsg(JSON.stringify(move_schema))

		// Waiting for response from server
		let msg = undefined
		while (msg === undefined) {
			await new Promise((resolve) =>
				setTimeout(resolve, MOVE_RESULT_CHECK_INTERVAL_MS)
			)

			msg = this.wsClient?.messages.pop()
		}

		let move_result = JSON.parse(msg)

		if (move_result.error !== undefined) {
			throw new Error(move_result.error)
		}

		return move_result.died_stones_ids
	}

	undoMove(): void {
		throw new Error('Method not implemented.')
	}
	get playerTurn() {
		return 'Black'
	}
	get whiteScore(): any {
		return 0
	}
	get blackScore(): any {
		return 0
	}
	get moveNumber(): any {
		return 1
	}
	get blackStones(): any {
		return []
	}
	get whiteStones(): any {
		return []
	}
}
