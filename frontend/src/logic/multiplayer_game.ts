import createLocalStore from '../../libs'
import api from '../api/index'
import WSClient from '../api/ws_client'
import FieldType from './fields/enum'
import Game from './game'
import { MoveSchema } from '../api/models'

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

	makeMove(pointID: number): number[] {
		const [store, _setStore] = createLocalStore()

		const move_schema: MoveSchema = {
			game_id: store.room.game_id,
			point_id: pointID,
		}
		this.wsClient?.sendMsg(JSON.stringify(move_schema))
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
