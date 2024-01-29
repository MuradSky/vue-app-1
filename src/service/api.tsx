import axios from 'axios'

export const api = {
	async getCountries() {
		return await axios.get('.data/countries')
	},
	async getCities() {
		return await axios.get('./data/cities.json')
	},
	async getAddresses(cityId) {
		return await axios.get(`./data/addresses/${cityId}.json`)
	}
}
