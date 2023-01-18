import axios from 'axios'

import createLocalStore from '../../libs'
import { API } from '../constants'

/**
 * Api client to work with
 */
export class ApiClient {
	constructor(readonly apiURI: string) {}

	protected buildAbsolutePath(path: string): string {
		const url = new URL(path, this.apiURI)
		console.log(this.apiURI, url)
		return url.href
	}

	get headers() {
		const [store, _] = createLocalStore()

		if (store.user) {
			return { AUTHORIZATION: `${store.user.id}:${store.user.secure_id}` }
		}
	}

	async get(path: string, params?: Object) {
		return await axios
			.get(this.buildAbsolutePath(path), {
				params: params,
				headers: this.headers,
			})
			.catch((error) => {
				throw Error(error.response.data)
			})
	}

	async post(path: string, data?: Object, params?: Object) {
		return await axios
			.post(this.buildAbsolutePath(path), data, {
				params: params,
				headers: this.headers,
			})
			.catch((error) => {
				throw Error(error.response.data)
			})
	}

	async patch(path: string, data?: Object, params?: Object) {
		return await axios
			.patch(this.buildAbsolutePath(path), data, {
				params: params,
				headers: this.headers,
			})
			.catch((error) => {
				throw Error(error.response.data)
			})
	}
}

const apiClient = new ApiClient(API)
export default apiClient
