<script setup lang="ts">
    import {defineEmits, defineProps} from 'vue'
    import {store} from '../store'

    const { isMapContent } = defineProps<{ isMapContent: boolean }>()
    const emit = defineEmits<{ changeMapContent: [v: boolean] }>()

    const onClick = (value: boolean)=> {
        if (!store.isReady) return
        emit('changeMapContent', value)
    }
</script>

<template>
    <div class="switch-btn">
        <button :class="{ is_active: isMapContent }" @click="onClick(true)">Карта</button>
        <button :class="{ is_active: !isMapContent }" @click="onClick(false)">Список</button>
    </div>
</template>

<style scoped lang="scss">
    .switch-btn {
        display: flex;
        align-items: center;
        border-radius: 6px;
        border: 1px solid #DEDEDE;
        background:  #F5F5F5;
        height: 48px;
        margin-left: 28px;

        @media (max-width: 768px) {
            max-width: 500px;
            margin-left: 0;
            margin-bottom: 20px;
        }

        button {
            border-radius: 6px;

            color: #9FA7B6;
            font-size: 16px;
            font-weight: 500;
            line-height: 100%;
            flex: auto;
            height: 100%;
            padding: 15px 28px;
            margin: -1px;

            &:hover {
                background: rgba(#233440, .05);
            }

            &.is_active {
                color: #fff;
                background-color: #233440;
            }
        }
    }
</style>
