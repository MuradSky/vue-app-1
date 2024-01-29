<script setup lang="ts">
    import {ref, watch} from 'vue'
    import { RouterLink, useRoute } from 'vue-router'

    const route = useRoute()
    const path = ref(route.path)
    watch(()=> route.path, (newValue)=> {
        path.value = newValue
    })

</script>

<template>
    <header class="header" :class="{ justify_start: path === '/admin' }">
        <RouterLink to="/" v-if="path === '/admin'">
            На главную
        </RouterLink>

        <RouterLink to="/admin" v-if="path !== '/admin'">
            Вход в админ
        </RouterLink>
    </header>
</template>

<style scoped lang="scss">
    .header {
        display: flex;
        align-items: center;
        padding: 20px 50px;
        background-color: #009bdc;
        margin-bottom: 32px;
        &:not(.justify_start) {
            justify-content: flex-end;
        }
        a {
            font-weight: 700;
            font-size: 20px;
            color: #fff;
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        }
    }
</style>
