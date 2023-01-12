export type FetchedUser = {
	id: string
	username: string
}

export interface User extends FetchedUser {
	secureId: string
}

export type Room = {
	id: string
	player1_id: string
	player2_id: string | null
	game_id: string | null
}
