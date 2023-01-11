import axios from 'axios'
import { API } from '../constants'

/**
 * Api client to work with
 */
export class ApiClient {
	constructor(readonly apiURI: string) {}

	protected buildAbsolutePath(path: string): string {
		return new URL(path, this.apiURI).toString()
	}

	async get(path: string, params?: Object) {
		return await axios
			.get(this.buildAbsolutePath(path), { params: params })
			.catch((error) => {
				throw Error(error.response.data)
			})
	}

	async post(path: string, data?: Object, params?: Object) {
		return await axios
			.post(this.buildAbsolutePath(path), data, { params: params })
			.catch((error) => {
				throw Error(error.response.data)
			})
	}
}

const apiClient = new ApiClient(API)
export default apiClient
