import createLocalStore from '../../libs'
import api from '../api/index'
import WSClient from '../api/ws_client'
import FieldType from './fields/enum'
import Game from './game'

export default class MultiplayerGame implements Game {
	private wsClient: WSClient | null = null

	constructor(public fieldType: FieldType, public size: number) {}

	start() {
		const [store, setStore] = createLocalStore()

		if (store.room.game_id !== null) {
			// Starting game
			api
				.startGame(store.room?.id, this.fieldType, this.size)
				.then((game_with_link) => {
					// Updating room
					console.log(game_with_link)

					const room = store.room
					room.game_id = game_with_link.game.id
					setStore('room', room)
				})
		}

		// Opening ws
		this.wsClient = new WSClient(
			`ws://localhost:8000/games/ws/${store.room.id}`,
			store.user,
			(msg: string) => console.log(msg)
		)
	}

	makeMove(pointID: number): number[] {
		throw new Error('Method not implemented.')
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
