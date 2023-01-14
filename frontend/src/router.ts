import NotFound from './pages/404'
import GamePage from './pages/Game'
import LoginPage from './pages/Login'
import RoomsPage from './pages/rooms'
import RoomPage from './pages/rooms/[id]'

const routes = [
	{
		path: ['/', '/singleplayer', '/multiplayer'],
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
			{
				path: '/:id',
				component: RoomPage,
			},
		],
	},
	{
		path: '/404',
		component: NotFound,
	},
]

export default routes
