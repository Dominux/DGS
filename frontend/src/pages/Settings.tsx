import {
	GMobiledata,
	Settings as SettingsIcon,
	Warning,
} from '@suid/icons-material'
import {
	Button,
	Card,
	CardActions,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	NativeSelect,
	Stack,
} from '@suid/material'
import { createSignal, For } from 'solid-js'

import {
	defaultEnvTextures,
	defaultResolution,
	defaultTextureName,
} from '../constants'
import GameManager from '../logic/game_manager'

export type SettingsProps = {
	gm: GameManager
}

export function Settings(props: SettingsProps) {
	const [isOpened, setIsOpened] = createSignal(false)
	const [textureName, setTextureName] = createSignal(defaultTextureName)
	const [resolution, setResolution] = createSignal(defaultResolution)

	function updateTextureName(e: any) {
		const newVal = e.target.value
		setTextureName(newVal)

		updateTexture()
	}
	function updateResolution(e: any) {
		const newVal = e.target.value
		setResolution(newVal)

		updateTexture()
	}

	function updateTexture() {
		const envTexture = defaultEnvTextures[textureName()][resolution()]

		props.gm.setEnvTexture(envTexture)
	}

	return (
		<>
			<Card
				sx={{
					position: 'absolute',
					top: '1.5%',
					right: '1.5%',
					zIndex: 2,
					width: 'fit-content',
					borderRadius: '33%',
				}}
			>
				<CardActions sx={{ padding: 0 }}>
					<IconButton color="primary" onClick={() => setIsOpened(true)}>
						<SettingsIcon fontSize="large" />
					</IconButton>
				</CardActions>
			</Card>

			<Dialog
				maxWidth="xs"
				open={isOpened()}
				onClose={() => setIsOpened(false)}
			>
				<DialogTitle>Settings</DialogTitle>

				<DialogContentText
					sx={{ padding: '0 1rem', display: 'flex', alignItems: 'center' }}
				>
					<Warning
						color="warning"
						fontSize="large"
						sx={{ marginRight: '0.5rem' }}
					/>
					<div>
						Higher resolution requires downloading heavy &nbsp;
						<a href="https://polyhaven.com/hdris">HDR textures</a> &nbsp;(~
						10-500 MB) and more processing power from your machine
					</div>
				</DialogContentText>

				<DialogContent>
					<Stack direction={'row'} justifyContent={'space-evenly'}>
						<div>
							<div>Texture</div>
							<NativeSelect onChange={updateTextureName}>
								<For each={Object.keys(defaultEnvTextures)}>
									{(name) => <option>{name}</option>}
								</For>
							</NativeSelect>
						</div>

						<div>
							<div>Resolution</div>
							<NativeSelect onChange={updateResolution}>
								<For each={Object.keys(defaultEnvTextures[defaultTextureName])}>
									{(res) => <option>{res}</option>}
								</For>
							</NativeSelect>
						</div>
					</Stack>
				</DialogContent>

				<DialogActions>
					<Button onClick={() => setIsOpened(false)}>Close</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}
