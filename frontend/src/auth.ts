import { useNavigate } from '@solidjs/router'

import createLocalStore from '../libs'
import { fullLocation } from './router'

export function checkAuth() {
	const [store, setStore] = createLocalStore()
	const navigate = useNavigate()

	if (!store.user) {
		setStore('redirect', window.location.href)

		navigate(fullLocation('/login'))
	}
}
