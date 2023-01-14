import { Component, onMount, createSignal, Show } from 'solid-js'
import { useLocation, useNavigate } from '@solidjs/router'
import createLocalStore from '../../libs'

import styles from '../App.module.css'
import { SPHERE_RADIUS } from '../constants'
import GameManager from '../logic/game_manager'
import ModeChooser from '../components/ModeChooser'
import MultiplayerGame from '../logic/multiplayer_game'
import SingleplayerGame from '../logic/singleplayer_game'

const GamePage: Component = () => {
	const [gameManager, setGameManager] = createSignal<GameManager | undefined>()
	const navigate = useNavigate()
	const [store, setStore] = createLocalStore()
	const location = useLocation()

	const modes = [
		{
			label: 'SinglePlayer',
			onClick: () => {
				navigate('/singleplayer')
			},
		},
		{
			label: 'MultiPlayer',
			onClick: () => {
				navigate('/rooms')
			},
		},
	]

	onMount(() => {
		// Creating game
		setTimeout(() => {
			let innerGame = isMultiplayer() ? MultiplayerGame : SingleplayerGame
			let gm = new GameManager(canvas, SPHERE_RADIUS, innerGame)
			setGameManager(gm)

			if (!isRoot()) startGUI()
		}, 0)
	})

	let canvas: HTMLCanvasElement

	const isRoot = () => location.pathname === '/'
	const isMultiplayer = () => location.pathname === '/multiplayer'

	function startGUI() {
		// Show GUI
		let gm = gameManager()
		gm?.showGUI()
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
