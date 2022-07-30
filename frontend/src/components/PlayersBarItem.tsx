import { Component } from 'solid-js'

import ListItem from '@suid/material/ListItem'
import Card from '@suid/material/Card'
import CardContent from '@suid/material/CardContent'
import Typography from '@suid/material/Typography'
import Avatar from '@suid/material/Avatar'
import { blueGrey, red } from '@suid/material/colors'

export type PlayersBarItemProps = {
	color: string
	score: number
	isTurn: boolean
}

const PlayersBarItem: Component<PlayersBarItemProps> = (props) => {
	return (
		<>
			<ListItem disablePadding>
				<Card
					sx={{
						bgcolor: props.isTurn ? red[300] : blueGrey[100],
						display: 'flex',
						borderRadius: 0,
					}}
				>
					<CardContent
						sx={{
							display: 'flex',
							flexDirection: 'row',
						}}
					>
						<Typography
							component="div"
							variant="h4"
							sx={{
								width: '5em',
								textAlign: 'center',
								lineHeight: '1.5em',
							}}
						>
							{props.score}
						</Typography>
						<Avatar
							sx={{
								bgcolor: props.color,
								width: '3em',
								height: '3em',
							}}
						>
							{' '}
						</Avatar>
					</CardContent>
				</Card>
			</ListItem>
		</>
	)
}

export default PlayersBarItem
