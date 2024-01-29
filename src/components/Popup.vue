<script setup lang="ts">
    import PopupSelect from './PopupSelect.vue'
    import Loader from './Loader.vue'
    import { store } from '../store'
</script>

<template>
    <div class="popup">
        <PopupSelect />
        <div class="popup__body">
            <div class="loader" v-if="store.hints.isLoading">
                <Loader />
            </div>
            <ul class="popup__list" :class="{ is_disabled: !store.isReady || store.hints.isLoading }">
                <li
                    v-for="hint in store.hints.data"
                    @click="store.selectGeoPointId = hint.id"
                    :class="{ is_active: store.selectGeoPointId === hint.id }"
                >
                    <div class="popup__name">{{ hint.name }}</div>
                    <div class="popup__label" v-if="hint.address">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M1.90039 5.99055C1.90039 3.23055 4.20678 0.999756 6.9966 0.999756C9.79428 0.999756 12.1007 3.23055 12.1007 5.99055C12.1007 7.38134 11.5949 8.67254 10.7623 9.76694C9.84389 10.9741 8.71187 12.0259 7.43767 12.8515C7.14604 13.0423 6.88285 13.0567 6.56279 12.8515C5.28132 12.0259 4.1493 10.9741 3.23873 9.76694C2.40559 8.67254 1.90039 7.38134 1.90039 5.99055ZM5.31836 6.14582C5.31836 7.07042 6.07284 7.79761 6.99794 7.79761C7.92364 7.79761 8.68538 7.07042 8.68538 6.14582C8.68538 5.22842 7.92364 4.46582 6.99794 4.46582C6.07284 4.46582 5.31836 5.22842 5.31836 6.14582Z" fill="#9FA7B6"/>
                        </svg>
                        {{ hint.address }}
                    </div>
                    <div class="popup__label">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M6.99935 12.8334C10.221 12.8334 12.8327 10.2217 12.8327 7.00008C12.8327 3.77842 10.221 1.16675 6.99935 1.16675C3.77769 1.16675 1.16602 3.77842 1.16602 7.00008C1.16602 10.2217 3.77769 12.8334 6.99935 12.8334ZM7.43685 4.08342C7.43685 3.84179 7.24097 3.64591 6.99935 3.64591C6.75772 3.64591 6.56185 3.84179 6.56185 4.08342V7.00008C6.56185 7.1884 6.68235 7.35558 6.861 7.41513L8.611 7.99846C8.84022 8.07487 9.08799 7.95099 9.1644 7.72177C9.24081 7.49254 9.11692 7.24477 8.8877 7.16837L7.43685 6.68475V4.08342Z" fill="#9FA7B6"/>
                        </svg>
                        {{ hint.time }}
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .popup {
        position: absolute;
        top: 50%;
        left: 7.2%;
        z-index: 100;
        transform: translateY(-50%);
        width: 100%;
        max-width: 420px;
        padding: 30px;
        background-color: #fff;

        @media (max-width: 1600px) {
            left: 50px;
        }

        @media (max-width: 1250px) {
            left: 20px;
        }

        @media (max-width: 1024px) {
            padding: 20px;
            max-width: 340px;
        }

        @media (max-width: 768px) {
            display: none;
        }

        &__select {
            width: 100%;

            &:not(:last-child) {
                margin-bottom: 10px;
            }
        }

        &__body {
            margin-top: 20px;
            position: relative;

            .loader {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        }

        &__list {
            max-height: 420px;
            min-height: 420px;
            overflow: hidden;
            overflow-y: auto;
            padding-right: 10px;
            &::-webkit-scrollbar {
                width: 2px;
            }

            &::-webkit-scrollbar-track {
                background-color: #fff;
            }

            &::-webkit-scrollbar-thumb {
                background-color: #bebec0;
            }

            &.is_disabled {
                opacity: .3;
                pointer-events: none;
            }

            li {
                cursor: pointer;
                padding: 20px 0;
                transition: border .3s linear;
                &:not(:last-child) {
                    border-bottom: 1px solid #dedede;
                }


                &:hover {
                    border-color: #009BDC;
                    .popup__name {
                        color: #00ADF6;
                    }
                }

                &.is_active {
                    border-color: #009BDC;
                    .popup__name {
                        color: #0057BE;
                    }
                }
            }
        }

        &__name {
            font-size: 16px;
            font-weight: 700;
            line-height: 100%;
            color: #020813;
            margin-bottom: 16px;
            transition: color .3s linear;
        }

        &__label {
            font-size: 12px;
            line-height: 100%;
            color: #020813;
            display: flex;

            &:not(:last-child) {
                margin-bottom: 10px;
            }

            svg {
                width: 14px;
                min-width: 14px;
                height: 14px;
                margin-right: 6px;
            }
        }
    }
</style>
