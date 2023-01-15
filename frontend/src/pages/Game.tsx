import { Component, onMount, createSignal, Show } from 'solid-js'
import { useLocation, useNavigate } from '@solidjs/router'

import styles from '../App.module.css'
import { SPHERE_RADIUS } from '../constants'
import GameManager from '../logic/game_manager'
import ModeChooser from '../components/ModeChooser'
import MultiplayerGame from '../logic/multiplayer_game'
import SingleplayerGame from '../logic/singleplayer_game'
import createLocalStore from '../../libs'
import api from '../api'
import { realLocation } from '../router'

const GamePage: Component = () => {
	const [gameManager, setGameManager] = createSignal<GameManager | undefined>()
	const navigate = useNavigate()
	const location = useLocation()
	const [store, setStore] = createLocalStore()

	const modes = [
		{
			label: 'SinglePlayer',
			onClick: () => {
				{
					navigate(realLocation('/singleplayer'))
					startGUI()
				}
			},
		},
		{
			label: 'MultiPlayer',
			onClick: () => {
				navigate(realLocation('/rooms'))
			},
		},
	]

	onMount(() => {
		// Creating game
		setTimeout(async () => {
			let innerGame = isMultiplayer() ? MultiplayerGame : SingleplayerGame
			let gm = new GameManager(canvas, SPHERE_RADIUS, innerGame)
			setGameManager(gm)

			if (!isRoot()) await startGUI()
		}, 0)
	})

	let canvas: HTMLCanvasElement

	const isRoot = () => location.pathname === realLocation('/')
	const isMultiplayer = () => location.pathname === realLocation('/multiplayer')

	async function startGUI() {
		if (isMultiplayer()) {
			const room = await api.getRoom(store.room.id)
			setStore('room', room)
			await joinStartedGame()
		}

		if (isMultiplayer() && store.user.id === store.room.player2_id) return

		// Show GUI
		let gm = gameManager()
		gm?.showGUI()
	}

	async function joinStartedGame() {
		// Fetching
		if (!store.room.game_id) {
			return
		}
		const game = await api.getGameWithHistory(store.room.game_id)

		// Storing
		setStore('game', game)

		// Setting
		let gm = gameManager()
		gm.fieldType = game.history.history.field_type
		gm.size = game.history.history.size
		gm?.setField()

		// Starting game
		await gm?.gameStart()
	}

	return (
		<>
			{/* Game Canvas */}
			<canvas ref={canvas} class={styles.canvas}></canvas>

			<Show when={isRoot()}>
				<ModeChooser modes={modes} />
			</Show>
		</>
	)
}

export default GamePage
