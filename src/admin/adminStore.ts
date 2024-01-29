import {reactive, watch, watchEffect} from 'vue'

export const adminStore = reactive({
	isLogin: false,
	token: null,
	admin: null,
})

const token = localStorage.getItem('_admin_token')

watchEffect(()=> {
	if (!token){
		localStorage.removeItem('_admin_token')
	}
})

watchEffect(()=> {
	if (token) {
		adminStore.isLogin = true
	}
})

watch(()=> adminStore.token, (newValue)=> {
	if (newValue) {
		localStorage.setItem('_admin_token', newValue)
	} else {
		localStorage.removeItem('_admin_token')
	}
})
