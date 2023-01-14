import CssBaseline from '@suid/material/CssBaseline'
import Box from '@suid/material/Box'
import Container from '@suid/material/Container'
import { createTheme, ThemeProvider } from '@suid/material/styles'
import { Component, createSignal, onMount, Show } from 'solid-js'
import { useNavigate, useParams } from '@solidjs/router'
import { Button, Card, CardContent, Stack, Typography } from '@suid/material'
import { grey } from '@suid/material/colors'

import createLocalStore from '../../../libs'
import api from '../../api'
import { checkAuth } from '../../auth'
import { FetchedUser } from '../../api/models'

const theme = createTheme()

export default function RoomPage() {
	const [store, setStore] = createLocalStore()
	const params = useParams()
	const navigate = useNavigate()
	const [anotherPlayer, setAnotherPlayer] = createSignal<FetchedUser | null>(
		null
	)

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

		// If the user is the player 1 -> another player is (or will be) the player 2
		if (isUserPlayer1()) {
			/// Trying to fetch player 2
			if (store.room.player2_id !== null) {
				const player_2 = await api.getUser(store.room.player2_id)
				setAnotherPlayer(player_2)
			}
		} else {
			// user can be the player 2, so it's up to him to decide whether to be or not
			const player_1 = await api.getUser(store.room.player1_id)
			setAnotherPlayer(player_1)
		}
	})

	const isUserPlayer1 = () => store.room?.player1_id === store.user?.id

	async function enterRoom() {
		const room = await api.enterRoom(store.room.id)
		setStore('room', room)
	}

	return (
		<ThemeProvider theme={theme}>
			<Container component="main">
				<CssBaseline />
				<Box
					sx={{
						marginTop: 8,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Stack spacing={3}>
						<PlayerCard
							color={grey[50]}
							bg={grey[900]}
							player_name={
								isUserPlayer1()
									? store.user?.username
									: anotherPlayer()?.username
							}
						></PlayerCard>

						<Show when={!isUserPlayer1() && store.room?.player2_id === null}>
							<Button variant="contained" onClick={() => enterRoom()}>
								Enter room
							</Button>
						</Show>
						<Show when={store.room?.player2_id !== null}>
							<PlayerCard
								color={grey[900]}
								bg={grey[50]}
								player_name={
									isUserPlayer1()
										? anotherPlayer()?.username
										: store.user?.username
								}
							></PlayerCard>
						</Show>
					</Stack>

					<Show
						when={
							store?.room?.player1_id !== null &&
							store?.room?.player2_id !== null
						}
					>
						<Button
							sx={{ marginTop: '5rem' }}
							variant="contained"
							onClick={() => navigate('/multiplayer')}
							size="large"
						>
							Enter game
						</Button>
					</Show>
				</Box>
			</Container>
		</ThemeProvider>
	)
}

type PlayerCardProps = {
	bg: string
	color: string
	player_name: string
}

const PlayerCard: Component<PlayerCardProps> = (props) => {
	return (
		<Card sx={{ background: props.bg, color: props.color }}>
			<CardContent>
				<Typography variant="h4">{props.player_name}</Typography>
			</CardContent>
		</Card>
	)
}
