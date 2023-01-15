import { useNavigate } from '@solidjs/router'

import createLocalStore from '../libs'
import { realLocation } from './router'

export function checkAuth() {
	const [store, _setStore] = createLocalStore()
	const navigate = useNavigate()

	if (!store.user) {
		navigate(realLocation('/login'))
	}
}
