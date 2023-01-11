export type User = {
	id: string
	username: string
	secureId: string
}

export type Room = {
	id: string
	player1_id: string
	player2_id: string | null
	game_id: string | null
}
