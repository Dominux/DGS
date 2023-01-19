import { useLocation, useNavigate } from '@solidjs/router'

import createLocalStore from '../libs'
import { fullLocation } from './router'

export function checkAuth() {
	const [store, setStore] = createLocalStore()
	const navigate = useNavigate()
	const location = useLocation()

	if (!store.user) {
		setStore('redirect', location.pathname)

		navigate(fullLocation('/login'))
	}
}
