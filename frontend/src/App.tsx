import Alert from '@suid/material/Alert'
import AlertTitle from '@suid/material/AlertTitle'
import { Component, createSignal, onMount, Show } from 'solid-js'

import styles from './App.module.css'
import PlayersBar from './components/PlayersBar'
import { ERROR_MSG_TIMEOUT, SPHERE_RADIUS } from './constants'
import Game from './logic/game'
import Scene from './logic/scene'
import { Field } from './logic/fields/interface'
import FieldType, { getFieldFromType } from './logic/fields/enum'
import GameManager from './logic/game_manager'

const App: Component = () => {
	// TODO: bind changing grid size
	const [isStarted, setIsStarted] = createSignal(false)
	const [gridSize, setGridSize] = createSignal(9)
	const [fieldType, setFieldType] = createSignal(FieldType.GridSphere)
	const [playerTurn, setPlayerTurn] = createSignal('Black')
	const [blackScore, setBlackScore] = createSignal(0)
	const [whiteScore, setWhiteScore] = createSignal(0)
	const [scene, setScene] = createSignal<Scene | undefined>()
	const [field, setField] = createSignal<Field | undefined>()
	const [errorMessage, setErrorMessage] = createSignal('')
	const [isUndoHidden, setIsUndoHidden] = createSignal(true)

	function onChangeGridSize(newVal: number) {
		setGridSize(newVal)
		setCurrentField()
	}

	function onSelectFieldType(newVal: FieldType) {
		setFieldType(newVal)
		setCurrentField()
	}

	function onStart() {
		setIsStarted(true)

		// Starting game
		const game_field = field()
		const game = new Game(gridSize(), fieldType())
		game_field?.start(game, onEndMove, onDeath, onError)

		setField(game_field)
	}

	function onEndMove() {
		setPlayerTurn(field()?.playerTurn)

		setIsUndoHidden(field()?.game?.moveNumber <= 1)
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

	/** Replacing old field with a new one */
	function setCurrentField() {
		const klass = getFieldFromType(fieldType())
		const newField = new klass(scene()?._scene, gridSize())
		field()?.delete()
		setField(newField)
	}

	function undoMove() {
		field()?.undoMove()

		setBlackScore(field()?.blackScore)
		setWhiteScore(field()?.whiteScore)
		setPlayerTurn(field()?.playerTurn)
		setIsUndoHidden(field()?.game?.moveNumber <= 1)
	}

	onMount(() => {
		// Creating game
		setTimeout(() => new GameManager(canvas, SPHERE_RADIUS), 0)
	})

	let canvas: HTMLCanvasElement

	return (
		<div class={styles.App}>
			{/* Game Canvas */}
			<canvas ref={canvas} class={styles.canvas}></canvas>

			<div class={styles.ux}>
				{/* <GameCreationForm
					onInputGridSize={onChangeGridSize}
					onSelectFieldType={onSelectFieldType}
					onStart={onStart}
				></GameCreationForm> */}
				<Show when={isStarted()}>
					<PlayersBar
						playersTurn={playerTurn()}
						blackScore={blackScore()}
						whiteScore={whiteScore()}
						isUndoHidden={isUndoHidden()}
						onUndoClicked={undoMove}
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
