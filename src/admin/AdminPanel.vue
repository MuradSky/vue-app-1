<script setup lang="ts">
    import {adminStore} from './adminStore'
    import {onMounted} from 'vue'
    import {authorization} from './api'

    onMounted(()=> {
       authorization()
    })

</script>

<template>
    <div class="panel">
        <div class="container wrap">
            <div class="header">
                Admin:
                <span>{{ adminStore?.admin?.email }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .panel {

    }

    .header {

    }
</style>
