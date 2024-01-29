<script setup lang="ts">
    import {store} from '../store'
</script>

<template>
    <ul class="cities" >
        <li v-for="city in store.cities">
            <label>
                <input
                    type="radio"
                    name="dealer-cities"
                    :value="city.id"
                    v-model="store.cityId"
                    :checked="city.id === store.cityId"
                    :disabled="!store.isReady"
                >
                <span class="cities__btn" :class="{is_active: city.id === store.cityId}">
                    {{city.value}}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="16" height="16" rx="8" fill="#009BDC"/>
                        <rect x="0.5" y="0.5" width="15" height="15" rx="7.5" stroke="#0057BE" stroke-opacity="0.3"/>
                        <path d="M4 8.33339L6.66686 10.9048L12 5.76196" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </span>
            </label>
        </li>
    </ul>
</template>

<style scoped lang="scss">
    .cities {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin: -5px;
        padding-bottom: 24px;
        position: relative;

        li {
            margin: 5px;
            transition: opacity .3s linear;
            &.is_disabled {
                pointer-events: none;
                opacity: .3;
            }
        }

        li label {
            position: relative;
            display: flex;
            align-items: center;
            cursor: pointer;
        }

        li label input {
            position: absolute;
            top: 0;
            left: -1000%;
            visibility: hidden;

            &:checked ~ .cities__btn {
                color: rgba(#233440, 1);
                border-color: #009BDC;

                svg {
                    opacity: 1;
                }
            }
        }


        &__btn {
            position: relative;
            padding: 12px 13px;
            border-radius: 6px;
            border: 1px solid rgba(35, 52, 64, 0.20);
            background-color: #EFF6FA;

            font-size: 16px;
            font-weight: 400;
            line-height: 100%;
            color: rgba(#233440, .7);
            transition: background-color .3s linear, color .3s linear, border .3s linear;

            &:hover:not(:active) {
                background-color: #e9f4fc;
            }

            svg {
                width: 16px;
                height: 16px;
                position: absolute;
                top: calc(-10px / 2);
                right: calc(-10px / 2);
                opacity: 0;
            }
        }
    }
</style>
