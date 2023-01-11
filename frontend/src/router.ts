import { lazy } from 'solid-js'
import { useNavigate } from '@solidjs/router'

import RoomsPage from './pages/Rooms'
import GamePage from './pages/Game'
import LoginPage from './pages/Login'
import createLocalStore from '../libs'

function checkIfRegistered() {
	const [store, setStore] = createLocalStore()
	const navigate = useNavigate()

	if (!store.user) {
		navigate('/login')
	}
}

const routes = [
	{
		path: '/',
		component: GamePage,
	},
	{
		path: '/login',
		component: LoginPage,
	},
	{
		path: '/rooms',
		children: [
			{
				path: '/',
				component: lazy(() => {
					checkIfRegistered()
					new Promise(() => RoomsPage)
				}),
			},
		],
	},
]

export default routes
