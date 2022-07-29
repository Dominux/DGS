import { Component, createSignal, onMount, Show } from 'solid-js'

import styles from './App.module.css'
import GameCreationForm from './components/GameCreationForm'
import Game from './logic/game'
import Scene from './logic/scene'
import GridSphere from './logic/spheres/grid_sphere'

const App: Component = () => {
	// TODO: bind changing grid size
	const [isStarted, setIsStarted] = createSignal(false)
	const [gridSize, setGridSize] = createSignal(9)
	const [scene, setScene] = createSignal<Scene | undefined>()
	const [field, setField] = createSignal<GridSphere | undefined>()

	function onChangeGridSize(newVal: number) {
		setGridSize(newVal)

		// Replacing old sphere with a new one
		const newSphere = new GridSphere(scene()._scene, gridSize())
		field()?.delete()

		setField(newSphere)
	}

	function onStart() {
		setIsStarted(true)

		// Starting game
		const game_field = field()
		const game = new Game(gridSize())
		game_field?.start(game)
		setField(game_field)
	}

	onMount(() => {
		// Creating game
		const _scene = new Scene(canvas)
		setScene(_scene)
		setField(new GridSphere(_scene._scene, gridSize()))
	})

	let canvas: HTMLCanvasElement

	return (
		<div class={styles.App}>
			{/* Game Canvas */}
			<canvas ref={canvas} class={styles.canvas}></canvas>

			<Show when={!isStarted()}>
				<GameCreationForm
					onChange={onChangeGridSize}
					onStart={onStart}
				></GameCreationForm>
			</Show>
		</div>
	)
}

export default App
