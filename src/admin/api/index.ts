import axios from 'axios'
import {adminStore} from '../adminStore'

export const authorization = async ()=> {
	const token = localStorage.getItem('_admin_token')

	try {
		const res = await axios.get('/auth', {
			headers: {
				Authorization: `Bearer ${token}`
			}
		})
		adminStore.admin = res.data.admin
		adminStore.token = res.data.token
		adminStore.isLogin = true

	} catch (err) {
		alert(err.response.data.message)
		localStorage.removeItem('_admin_token')
		adminStore.admin = adminStore.token = null
		adminStore.isLogin = false
	}
}

export const loginHandler = async (data, cb)=> {
	try {
		const res = await axios.post('/login', data)
		adminStore.admin = res.data.admin
		adminStore.token = res.data.token
		adminStore.isLogin = true
	} catch (err) {
		console.log(err)
		alert(err.response.data.message)
	} finally {
		cb()
	}
}

// const registerHandler = async ()=> {
// 	try {
// 		const res = await axios.post('/registration', inputs.value)
// 		alert(res.data.message)
// 		isLogin.value = true
// 	} catch (err) {
// 		alert(err.response.data.message)
// 	} finally {
// 		isLoading.value = false
// 	}
// }
