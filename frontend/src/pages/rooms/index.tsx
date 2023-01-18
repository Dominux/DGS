import Button from '@suid/material/Button'
import CssBaseline from '@suid/material/CssBaseline'
import Box from '@suid/material/Box'
import Container from '@suid/material/Container'
import { createTheme, ThemeProvider } from '@suid/material/styles'
import { onMount } from 'solid-js'

import createLocalStore from '../../../libs'
import api from '../../api'
import { useNavigate } from '@solidjs/router'
import { checkAuth } from '../../auth'
import { fullLocation } from '../../router'

const theme = createTheme()

export default function RoomsPage() {
	const [_store, setStore] = createLocalStore()
	const navigate = useNavigate()

	onMount(() => {
		checkAuth()
	})

	const createRoom = async () => {
		// Creating room
		const room = await api.createRoom()

		// Storing it
		setStore('room', room)

		// Moving to the room
		navigate(fullLocation(`/rooms/${room.id}`))
	}

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
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
						onClick={() => createRoom()}
					>
						Create room
					</Button>
				</Box>
			</Container>
		</ThemeProvider>
	)
}
