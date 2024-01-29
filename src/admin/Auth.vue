<script setup lang="ts">
    import {ref, watch} from 'vue'
    import {loginHandler} from './api'

    const isLoading = ref(false)

    const inputs = ref({
        email: '',
        password: '',
        emailError: '',
        passwordError: ''
    })

    const onSubmit = async ()=> {
        if (inputs.value.email === '') {
            inputs.value.emailError = 'Обязательное поле'
        }

        if (inputs.value.password === '') {
            inputs.value.passwordError = 'Обязательное поле'
        }

        if (inputs.value.email === '' || inputs.value.password === '') return
        isLoading.value = true

        loginHandler(inputs.value, ()=> isLoading.value = false)
    }

    watch(()=> inputs.value.email, ()=> {
        inputs.value.emailError = ''
    })
    watch(()=> inputs.value.password, ()=> {
        inputs.value.passwordError = ''
    })
</script>

<template>
    <div class="form">
        <div class="title">Вход</div>
        <form @submit.prevent="onSubmit">
            <input
                type="email"
                name="email"
                v-model="inputs.email"
                placeholder="Email"
                :disabled="isLoading"
                :class="{ is_error: inputs.emailError }"
            >
            <span class="error" v-if="inputs.emailError">{{ inputs.emailError }}</span>
            <input
                type="password"
                name="password"
                v-model="inputs.password"
                placeholder="password"
                :disabled="isLoading"
                :class="{ is_error: inputs.passwordError }"
            >
            <span class="error" v-if="inputs.passwordError">{{ inputs.passwordError }}</span>

            <div class="button">
                <button
                    class="btn"
                    :disabled="isLoading"
                >Войти</button>
            </div>
        </form>
    </div>
</template>

<style scoped lang="scss">
.form {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;

    border: 1px solid #0057BE;
    padding: 25px;
    border-radius: 10px;

    background-color: rgba(#0057BE, .05);

    form {

    }

    input {
        display: block;
        width: 100%;
        height: 45px;
        padding: 10px;
        border-radius: 10px;
        border: 1px solid #0057BE;
        &:not(:last-child) {
            margin-bottom: 24px;
        }

        &.is_error {
            border-color: red;
        }
    }
}

.error {
    display: block;
    transform: translateY(-15px);
    color: red;
    font-size: 14px;
}

.title {
    text-align: center;
    font-size: 32px;
    font-weight: 700;
    padding-bottom: 24px;
}

.btn {
    background-color: #009bdc;
    padding: 10px 25px;
    border-radius: 10px;
    color: #fff;

    &:hover:not(:active) {
        background-color: #0057BE;
    }
}

.link {
    text-decoration: underline;

    &:hover:not(:active) {
        color: #0057BE;
    }
}

.button {
    display: flex;
    justify-content: space-between;
}
</style>
