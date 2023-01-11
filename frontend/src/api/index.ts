import apiClient from './api_client'
import { User } from './models'

async function register(username: string): Promise<User> {
	const res = await apiClient.post('/users', { username: username })
	return res.data
}

const api = {
	register: register,
}

export default api
