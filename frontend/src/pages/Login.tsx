import Avatar from '@suid/material/Avatar'
import Button from '@suid/material/Button'
import CssBaseline from '@suid/material/CssBaseline'
import TextField from '@suid/material/TextField'
import Box from '@suid/material/Box'
import LockOutlinedIcon from '@suid/icons-material/LockOutlined'
import Typography from '@suid/material/Typography'
import Container from '@suid/material/Container'
import { createTheme, ThemeProvider } from '@suid/material/styles'
import { createSignal } from 'solid-js'

const theme = createTheme()

export default function Login(props: LoginProps) {
	const [usernameError, setUsernameError] = createSignal('')

	const handleSubmit = (event: SubmitEvent) => {
		event.preventDefault()
		const data = new FormData(event.currentTarget)

		props.onSumbit({
			username: data.get('username'),
			// password: data.get('password'),
		})
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
