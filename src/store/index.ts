import {reactive, watch, watchEffect} from 'vue'
import {api} from '../service/api'


export const store = reactive({
	isReady: false,
	countryId: 1,
	cityId: 1,
	searchByCity: '',
	selectByTypeStoreBranch: '',

	selectGeoPointId: null,

	countries: [],
	cities: [],

	hints: {
		isLoading: true,
		data: [],
		savedData: [],
	},
	filterByTypesValues: [],
	async getCountries() {
		await api.getCountries()
	},

	async getCities() {
		try {
			const { data } = await api.getCities()
			const cities: any = data.find(item => item.id === this.countryId)?.cities
			this.countries = data
			this.cities = cities
			this.cityId = cities[0].id
		} catch (err) {
			console.log(err)
		}
	},

	async getAddresses() {
		this.hints.isLoading = true
		this.selectGeoPointId = null
		try {
			const { data } = await api.getAddresses(this.cityId)

			if (this.filterByTypesValues.length > 0) {
				this.hints.data = data.hints.filter(city => this.filterByTypesValues.findIndex(v => v === city.shop_type) !== -1)
			} else {
				this.hints.data = data.hints || []
			}
			this.hints.savedData = data.hints || []
		} catch (err) {
			console.log(err)
		} finally {
			this.hints.isLoading = false
		}
	},

	changeCountry() {
		const cities: any = this.countries.find(item => item.id === this.countryId)?.cities
		this.cities = cities
		this.cityId = cities[0].id
	},

	filteredAddressesByType(types) {
		if (types.length === 0) {
			return this.hints.data = this.hints.savedData
		}
		const filteredShops = this.hints.savedData.filter(city => types.findIndex(v => v === city.shop_type) !== -1)
		this.hints.data = filteredShops
	}
})

watchEffect(()=> {
	store.getCountries()
})

watchEffect(()=> {
	store.getCities()
})

watchEffect(()=> {
	store.getAddresses()
})

watch(()=> store.countryId, ()=> {
	store.changeCountry()
})

watch(()=> store.cityId, async ()=> {
	await store.getAddresses()
})

watch(()=> store.filterByTypesValues, (newValue)=> {
	store.filteredAddressesByType(newValue)
})
