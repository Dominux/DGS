import RoomsPage from './pages/Rooms'
import GamePage from './pages/Game'
import LoginPage from './pages/Login'

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
