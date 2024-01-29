<script setup lang="ts">
    import Auth from './Auth.vue'
    import AdminPanel from './AdminPanel.vue'
    import {adminStore} from './adminStore'

</script>

<template>
    <Auth v-if="!adminStore.isLogin"/>
    <AdminPanel v-else/>
</template>
