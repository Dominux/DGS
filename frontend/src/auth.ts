import { useNavigate } from '@solidjs/router'

import createLocalStore from '../libs'

export function checkAuth() {
	const [store, setStore] = createLocalStore()
	const navigate = useNavigate()

	if (!store.user) {
		navigate('/login')
	}
}
