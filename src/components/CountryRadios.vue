<script setup lang="ts">
    import {store} from '../store'
</script>

<template>
    <ul class="countries">
        <li v-for="country in store.countries">
            <label>
                <input
                    type="radio"
                    name="country"
                    :value="country.id"
                    v-model="store.countryId"
                    :checked="country.id === store.countryId"
                    :disabled="!store.isReady"
                >
                <span class="countries__btn"></span>
                <span class="countries__name">{{country.value}}</span>
                <span class="countries__flag">
                    <img :src="'src/assets/image/flags/'+country.flag+'.svg'" alt="" width="28" height="18">
                </span>
            </label>
        </li>
    </ul>
</template>

<style scoped lang="scss">
    .countries {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin: -10px -16px 0;
        li {
            margin: 10px 16px 0;
        }

        li label {
            position: relative;
            cursor: pointer;
            display: flex;
            align-items: center;
        }

        li label input {
            position: absolute;
            left: -1000%;
            visibility: hidden;

            &:checked ~ .countries__btn {
                background-color: #009BDC;
                border-color: #fff;
                outline-color:  #009BDC;
            }
        }


        &__btn {
            width: 20px;
            min-width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: #f5f5f5;
            border: 3px solid #f5f5f5;
            outline: 1px solid #dedede;
            margin-right: 10px;
            transition: background-color .3s linear, border .3s linear, outline .3s linear;
        }

        &__name {
            font-size: 16px;
            font-weight: 500;
            line-height: 100%;
            color: #777;
        }

        &__flag {
            width: 28px;
            height: 18px;
            margin-left: 6px;
        }
    }
</style>
