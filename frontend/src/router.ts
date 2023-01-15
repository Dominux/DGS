import NotFound from './pages/404'
import GamePage from './pages/Game'
import LoginPage from './pages/Login'
import RoomsPage from './pages/rooms'
import RoomPage from './pages/rooms/[id]'
import { PREFIX_PATH } from './constants'

export function realLocation(rawLocation: string): string {
	return `${PREFIX_PATH}${rawLocation}`
}

const routes = [
	{
		path: [
			realLocation('/'),
			realLocation('/singleplayer'),
			realLocation('/multiplayer'),
		],
		component: GamePage,
	},
	{
		path: realLocation('/login'),
		component: LoginPage,
	},
	{
		path: realLocation('/rooms'),
		children: [
			{
				path: realLocation('/'),
				component: RoomsPage,
			},
			{
				path: realLocation('/:id'),
				component: RoomPage,
			},
		],
	},
	{
		path: realLocation('/404'),
		component: NotFound,
	},
]

export default routes
