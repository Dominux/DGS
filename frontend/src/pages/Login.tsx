import Avatar from '@suid/material/Avatar'
import Button from '@suid/material/Button'
import CssBaseline from '@suid/material/CssBaseline'
import TextField from '@suid/material/TextField'
import Box from '@suid/material/Box'
import LockOutlinedIcon from '@suid/icons-material/LockOutlined'
import Typography from '@suid/material/Typography'
import Container from '@suid/material/Container'
import { createTheme, ThemeProvider } from '@suid/material/styles'
import { createSignal, onMount } from 'solid-js'
import createLocalStore from '../../libs'

import api from '../api'
import { useNavigate } from '@solidjs/router'

const theme = createTheme()

export default function Login() {
	const [usernameError, setUsernameError] = createSignal('')
	const [store, setStore] = createLocalStore()
	const navigate = useNavigate()

	onMount(() => {
		// If user is registered => moving him to rooms
		if (store.user) {
			navigate('/rooms')
		}
	})

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault()
		const data = new FormData(event.currentTarget)

		// Creating user
		const user = await api.register(data.get('username'))

		// Setting it to store
		setStore('user', user)

		// Redirecting to rooms page
		navigate('/rooms')
	}

	const validateUsername = (e: InputEvent) => {
		const username: string = e.target?.value

		const errMsg = username.length === 0 ? 'Field is required' : ''
		setUsernameError(errMsg)
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
					<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Registration
					</Typography>
					<Box
						component="form"
						onSubmit={handleSubmit}
						noValidate
						sx={{ mt: 1 }}
					>
						<TextField
							margin="normal"
							required
							fullWidth
							id="username"
							label="User name"
							name="username"
							autoFocus
							helperText={usernameError()}
							error={usernameError().length !== 0}
							onInput={validateUsername}
							inputProps={{ maxLength: 15 }}
						/>
						{/* <TextField
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
						/> */}
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
							disabled={usernameError().length !== 0}
						>
							Register
						</Button>
					</Box>
				</Box>
			</Container>
		</ThemeProvider>
	)
}
