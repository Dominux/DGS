import { Component } from 'solid-js'

import List from '@suid/material/List'
import PlayersBarItem from './PlayersBarItem'

import styles from '../App.module.css'
export type PlayersBarProps = {
	playersTurn: string
	blackScore: number
	whiteScore: number
}

const PlayersBar: Component<PlayersBarProps> = (props) => {
	function isBlack() {
		return props.playersTurn.toLowerCase() === 'black'
	}

	return (
		<>
			<List
				sx={{
					position: 'absolute',
					top: 0,
					right: 0,
					// backgroundColor: 'white',
				}}
				disablePadding
			>
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
		</>
	)
}

export default PlayersBar
