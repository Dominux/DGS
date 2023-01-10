import { Component, onMount, createSignal, Show } from 'solid-js'

import styles from '../App.module.css'
import { SPHERE_RADIUS } from '../constants'
import GameManager from '../logic/game_manager'
import ModeChooser from '../components/ModeChooser'

const GamePage: Component = () => {
	const [gameManager, setGameManager] = createSignal<GameManager | undefined>()
	const [isChooseModeShow, setIsChooseModeShow] = createSignal(true)

	const modes = [
		{
			label: 'SinglePlayer',
			onClick: () => {
				// Show GUI
				let gm = gameManager()
				gm?.showGUI()

				// Hide Game manager
				setIsChooseModeShow(false)
			},
		},
		{
			label: 'MultiPlayer',
			onClick: () => {},
		},
	]

	onMount(() => {
		// Creating game
		setTimeout(() => {
			let gm = new GameManager(canvas, SPHERE_RADIUS)
			setGameManager(gm)
		}, 0)
	})

	let canvas: HTMLCanvasElement

	return (
		<>
			{/* Game Canvas */}
			<canvas ref={canvas} class={styles.canvas}></canvas>

			<Show when={isChooseModeShow()}>
				<ModeChooser modes={modes} />
			</Show>
		</>
	)
}

export default GamePage
