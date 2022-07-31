import Alert from '@suid/material/Alert'
import AlertTitle from '@suid/material/AlertTitle'
import { Component, createSignal, onMount, Show } from 'solid-js'

import styles from './App.module.css'
import GameCreationForm from './components/GameCreationForm'
import PlayersBar from './components/PlayersBar'
import { ERROR_MSG_TIMEOUT } from './constants'
import Game from './logic/game'
import Scene from './logic/scene'
import GridSphere from './logic/spheres/grid_sphere'

const App: Component = () => {
	// TODO: bind changing grid size
	const [isStarted, setIsStarted] = createSignal(false)
	const [gridSize, setGridSize] = createSignal(9)
	const [playerTurn, setPlayerTurn] = createSignal('Black')
	const [blackScore, setBlackScore] = createSignal(0)
	const [whiteScore, setWhiteScore] = createSignal(0)
	const [scene, setScene] = createSignal<Scene | undefined>()
	const [field, setField] = createSignal<GridSphere | undefined>()
	const [errorMessage, setErrorMessage] = createSignal('')

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
		game_field?.start(game, onEndMove, onDeath, onError)
		setField(game_field)
	}

	function onEndMove() {
		setPlayerTurn(field()?.playerTurn)
	}

	function onDeath() {
		if (playerTurn().toLowerCase() === 'black') {
			setBlackScore(field()?.blackScore)
		} else {
			setWhiteScore(field()?.whiteScore)
		}
	}

	function onError(errorMsg: string) {
		setErrorMessage(errorMsg)
		setTimeout(() => {
			if (errorMessage() === errorMsg) setErrorMessage('')
		}, ERROR_MSG_TIMEOUT * 1000)
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

			<div class={styles.ux}>
				<Show when={!isStarted()}>
					<GameCreationForm
						onChange={onChangeGridSize}
						onStart={onStart}
					></GameCreationForm>
				</Show>
				<Show when={isStarted()}>
					<PlayersBar
						playersTurn={playerTurn()}
						blackScore={blackScore()}
						whiteScore={whiteScore()}
					></PlayersBar>
				</Show>
				<Show when={errorMessage()}>
					<Alert
						severity="error"
						sx={{
							textAlign: 'left',
							width: 'fit-content',
							position: 'absolute',
							top: '0.7em',
							left: '0.5em',
						}}
					>
						<AlertTitle>Error</AlertTitle>
						{errorMessage()}
					</Alert>
				</Show>
			</div>
		</div>
	)
}

export default App
