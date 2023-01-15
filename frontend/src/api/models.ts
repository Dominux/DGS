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

export type MoveSchema = {
	game_id: string
	point_id: number
}

export type MoveResult = {
	point_id: number
	died_stones_ids: Array<number>
}

export type History = {
	id: string
	game_id: string
	size: number
	field_type: FieldType
}

export type HistoryRecord = {
	id: string
	history_id: string
	move_number: number
	point_id: number
	died_points_ids: Array<number>
}

export type HistoryWithRecords = {
	history: History
	records: Array<HistoryRecord>
}

export type GameWithHistory = {
	game: Game
	history: HistoryWithRecords
}
