export const MIN_GRIDSIZE = 5
export const MAX_GRIDSIZE = 255
export const INPUTFIELD_LENGTH_IN_SYMBOLS = 12

export const ERROR_MSG_TIMEOUT = 3

export const SPHERE_RADIUS = 0.5
export const REGULAR_FIELD_PADDING_TO_CELL_FRACTION = 0.5
export const ACCENT_COLOR = '#e3f2fd'
export const ALERT_COLOR = '#fa9393'

export const FIELD_Y = 1

export const API = import.meta.env.DEV
	? import.meta.env.VITE_DEV_API
	: import.meta.env.VITE_PROD_API

export const WS_API = import.meta.env.DEV
	? import.meta.env.VITE_DEV_WS
	: import.meta.env.VITE_PROD_WS

export const BASENAME = ''

export const MOVE_RESULT_CHECK_INTERVAL_MS = 200

export type EnvTexture = {
	url: string
	res: number
}

export const defaultEnvTextures = {
	'Rainforest trail': {
		'1K': {
			url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/rainforest_trail_1k.hdr',
			res: 512,
		},
		'2K': {
			url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/rainforest_trail_2k.hdr',
			res: 1024,
		},
		'4K': {
			url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/rainforest_trail_4k.hdr',
			res: 2048,
		},
		'8K': {
			url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/8k/rainforest_trail_8k.hdr',
			res: 4096,
		},
	},
	'Kiara Dawn': {
		'1K': {
			url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/kiara_1_dawn_1k.hdr',
			res: 512,
		},
		'2K': {
			url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/kiara_1_dawn_2k.hdr',
			res: 1024,
		},
		'4K': {
			url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/kiara_1_dawn_4k.hdr',
			res: 2048,
		},
		'8K': {
			url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/8k/kiara_1_dawn_8k.hdr',
			res: 4096,
		},
	},
	'Chinese garden': {
		'1K': {
			url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/chinese_garden_1k.hdr',
			res: 512,
		},
		'2K': {
			url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/chinese_garden_2k.hdr',
			res: 1024,
		},
		'4K': {
			url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/chinese_garden_4k.hdr',
			res: 2048,
		},
		'8K': {
			url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/8k/chinese_garden_8k.hdr',
			res: 4096,
		},
	},
	'Misty pines': {
		'1K': {
			url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/misty_pines_1k.hdr',
			res: 512,
		},
		'2K': {
			url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/misty_pines_2k.hdr',
			res: 1024,
		},
		'4K': {
			url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/misty_pines_4k.hdr',
			res: 2048,
		},
		'8K': {
			url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/8k/misty_pines_8k.hdr',
			res: 4096,
		},
		'Phalzer forest': {
			'1K': {
				url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/phalzer_forest_01_1k.hdr',
				res: 512,
			},
			'2K': {
				url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/phalzer_forest_01_2k.hdr',
				res: 1024,
			},
			'4K': {
				url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/phalzer_forest_01_4k.hdr',
				res: 2048,
			},
			'8K': {
				url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/8k/phalzer_forest_01_8k.hdr',
				res: 4096,
			},
		},
	},
}
export const defaultTextureName = Object.keys(defaultEnvTextures)[0]
export const defaultResolution = '1K'

export const GRID_MATERIAL =
	'https://raw.githubusercontent.com/Dominux/spherical-go/main/frontend/src/assets/gridMaterial.json'
