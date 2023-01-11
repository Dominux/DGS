import GamePage from './pages/Game'
import LoginPage from './pages/Login'
import RoomsPage from './pages/Rooms'

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
				component: RoomsPage,
			},
		],
	},
]

export default routes
