import createLocalStore from '../../libs'
import api from '../api/index'
import FieldType from './fields/enum'
import Game from './game'

export default class MultiplayerGame implements Game {
	constructor(public fieldType: FieldType, public size: number) {}

	async startGame() {
		const [store, _setStore] = createLocalStore()

		await api.startGame(store.room?.id, this.fieldType, this.size)
	}
}
