import CssBaseline from '@suid/material/CssBaseline'
import Box from '@suid/material/Box'
import Container from '@suid/material/Container'
import { createTheme, ThemeProvider } from '@suid/material/styles'
import { onMount } from 'solid-js'
import { useNavigate, useParams } from '@solidjs/router'

import createLocalStore from '../../../libs'
import api from '../../api'
import { checkAuth } from '../../auth'

const theme = createTheme()

export default function RoomPage() {
	const [store, setStore] = createLocalStore()
	const params = useParams()
	const navigate = useNavigate()

	onMount(async () => {
		checkAuth()

		// Getting room
		try {
			const room = await api.getRoom(params.id)

			// Inserting/Updating room in store
			setStore('room', room)
		} catch (e) {
			navigate('/404')
			return
		}
	})

	return (
		<ThemeProvider theme={theme}>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box
					sx={{
						marginTop: 8,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					Room {params.id}
				</Box>
			</Container>
		</ThemeProvider>
	)
}
