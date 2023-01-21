import { Component, onMount, createSignal, Show } from 'solid-js'
import { useLocation, useNavigate } from '@solidjs/router'

import styles from '../App.module.css'
import { SPHERE_RADIUS } from '../constants'
import GameManager from '../logic/game_manager'
import ModeChooser from '../components/ModeChooser'
import MultiplayerGame from '../logic/games/multiplayer_game'
import SingleplayerGame from '../logic/games/singleplayer_game'
import createLocalStore from '../../libs'
import api from '../api'
import { fullLocation } from '../router'
import { Settings } from './Settings'

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
					navigate(fullLocation('/singleplayer'))
					startGUI()
				}
			},
		},
		{
			label: 'MultiPlayer',
			onClick: () => {
				navigate(fullLocation('/rooms'))
			},
		},
	]

	onMount(() => {
		// Creating game
		setTimeout(async () => {
			let innerGame = isMultiplayer() ? MultiplayerGame : SingleplayerGame
			let gm = new GameManager(canvas, SPHERE_RADIUS, innerGame)
			await gm.setField()
			setGameManager(gm)

			if (!isRoot()) await startGUI()
		}, 0)
	})

	let canvas: HTMLCanvasElement

	const isRoot = () =>
		location.pathname === fullLocation('/') ||
		location.pathname === fullLocation('')
	const isMultiplayer = () => location.pathname === fullLocation('/multiplayer')

	async function startGUI() {
		if (isMultiplayer()) {
			const room = await api.getRoom(store.room.id)
			setStore('room', room)
			await joinStartedGame()
		}

		if (isMultiplayer() && store.user.id === store.room.player2_id) return

		// Show GUI
		if (!isMultiplayer() || !store.room.game_id) {
			let gm = gameManager()
			gm?.showGUI()
		}
	}

	async function joinStartedGame() {
		// Fetching
		if (!store.room.game_id) return

		const game = await api.getGameWithHistory(store.room.game_id)

		// Storing
		setStore('game', game)

		// Setting
		let gm = gameManager()

		gm.fieldType = game.history.history.field_type
		gm.gridSize = game.history.history.size

		await gm?.setField()

		// Starting game
		await gm?.gameStart()
	}

	return (
		<>
			{/* Game Canvas */}
			<canvas ref={canvas} class={styles.canvas}></canvas>

			<Settings gm={gameManager()} />

			<Show when={isRoot()}>
				<ModeChooser modes={modes} />
			</Show>
		</>
	)
}

export default GamePage
