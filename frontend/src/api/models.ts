import FieldType from '../logic/fields/enum'

export type FetchedUser = {
	id: string
	username: string
}

export interface User extends FetchedUser {
	secure_id: string
}

export type Room = {
	id: string
	player1_id: string
	player2_id: string | null
	game_id: string | null
}

export type Game = {
	id: string
	is_ended: boolean
}

export type GameWithLink = {
	game: Game
	ws_link: string
}

export interface StoredGame extends Game {
	field_type: FieldType
	size: number
}
