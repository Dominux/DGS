import { Component, createSignal } from 'solid-js'

import Drawer from '@suid/material/Drawer'
import Box from '@suid/material/Box'
import TextField from '@suid/material/TextField'
import List from '@suid/material/List'
import ListItem from '@suid/material/ListItem'
import Button from '@suid/material/Button'

import { MAX_GRIDSIZE, MIN_GRIDSIZE } from '../constants'

export type GameCreationFormProps = {
	onChange: Function
	onStart: Function
}

const GameCreationForm: Component<GameCreationFormProps> = (props) => {
	const [isValid, setIsValid] = createSignal(false)
	const [errorMessage, setErrorMessage] = createSignal('')

	function onInput(e) {
		const n = parseInt(e.target.value)

		if (validateGridSize(n)) {
			props.onChange(n)
		}
	}

	function validateGridSize(value: number) {
		// Now numbers must be between 5 and ...100, and also to be only odd
		const oddRangeStr = [MIN_GRIDSIZE, MIN_GRIDSIZE + 2, MIN_GRIDSIZE + 4].join(
			','
		)

		if (value < MIN_GRIDSIZE) {
			setErrorMessage(`Number must be >= ${MIN_GRIDSIZE}`)
			setIsValid(false)
			return false
		}
		if (value > MAX_GRIDSIZE) {
			setErrorMessage(`Number must be <= ${MAX_GRIDSIZE}`)
			setIsValid(false)
			return false
		}
		if (value % 2 == 0) {
			setErrorMessage(`Number must be odd (${oddRangeStr}, ...)`)
			setIsValid(false)
			return false
		}

		setErrorMessage('')
		setIsValid(true)
		return true
	}

	return (
		<>
			<Drawer anchor="right" open variant="persistent">
				<Box sx={{ width: 300, marginTop: '100%' }} role="form">
					<List>
						<ListItem sx={{ paddingBottom: 2 }}>
							<TextField
								error={!isValid()}
								sx={{ margin: '0 auto' }}
								id="standard-basic"
								label="Grid size"
								variant="standard"
								type="number"
								onChange={onInput}
								helperText={errorMessage()}
							/>
						</ListItem>
						<ListItem
							sx={{
								justifyContent: 'center',
							}}
						>
							<Button
								variant="contained"
								size="large"
								disabled={!isValid()}
								onClick={(e) => props.onStart()}
							>
								Start
							</Button>
						</ListItem>
					</List>
				</Box>
			</Drawer>
		</>
	)
}

export default GameCreationForm
