import FieldType from '../logic/fields/enum'
import apiClient from './api_client'
import { FetchedUser, GameWithLink, Room, User } from './models'

async function register(username: string): Promise<User> {
	const res = await apiClient.post('/users', { username: username })
	return res.data
}

async function getUser(id: string): Promise<FetchedUser> {
	const res = await apiClient.get(`/users/${id}`)
	return res.data
}

async function createRoom(): Promise<Room> {
	const res = await apiClient.post('/rooms')
	return res.data
}

async function getRoom(id: string): Promise<Room> {
	const res = await apiClient.get(`/rooms/${id}`)
	return res.data
}

async function enterRoom(id: string): Promise<Room> {
	const res = await apiClient.patch(`/rooms/${id}/enter`)
	return res.data
}

async function startGame(
	room_id: string,
	field_type: FieldType,
	size: number
): Promise<GameWithLink> {
	const res = await apiClient.post(`/games`, { room_id, field_type, size })
	return res.data
}

const api = {
	register,
	getUser,
	createRoom,
	getRoom,
	enterRoom,
	startGame,
}

export default api
