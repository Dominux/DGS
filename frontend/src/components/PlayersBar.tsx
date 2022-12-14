import { Component, createSignal } from 'solid-js'

import { Button } from '@suid/material'
import List from '@suid/material/List'

import PlayersBarItem from './PlayersBarItem'
import styles from '../App.module.css'

export type PlayersBarProps = {
	playersTurn: string
	blackScore: number
	whiteScore: number
	isUndoDisabled: boolean
	onUndoClicked: Function
}

const PlayersBar: Component<PlayersBarProps> = (props) => {
	function isBlack() {
		return props.playersTurn.toLowerCase() === 'black'
	}

	function onUndoClicked(_) {
		props.onUndoClicked()
	}

	return (
		<>
			<div class={styles.playersBar}>
				<List disablePadding>
					<PlayersBarItem
						color="black"
						score={props.blackScore}
						isTurn={isBlack()}
					></PlayersBarItem>
					<PlayersBarItem
						color="white"
						score={props.whiteScore}
						isTurn={!isBlack()}
						class={styles.bottomPlayersBarItem}
					></PlayersBarItem>
				</List>
				<Button
					sx={{ marginTop: '1rem', backgroundColor: 'white' }}
					size="large"
					disabled={props.isUndoDisabled}
					onClick={onUndoClicked}
				>
					Undo
				</Button>
			</div>
		</>
	)
}

export default PlayersBar
