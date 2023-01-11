import apiClient from './api_client'
import { Room, User } from './models'

async function register(username: string): Promise<User> {
	const res = await apiClient.post('/users', { username: username })
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

const api = {
	register,
	createRoom,
	getRoom,
}

export default api
