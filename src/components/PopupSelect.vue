<script setup lang="ts">
    import {ref, watch, onMounted} from 'vue'
    import CustomSelect from './custom-ui/CustomSelect.vue'
    import { store } from '../store'

    const data = ref( {
        defaultCountryValue: null,
        defaultCityValue: null,
    })

    const changeCountry = ({ id }: { id: number })=> {
        store.countryId = id
    }

    const changeCity = ({ id }: { id: number })=> {
        store.cityId = id
    }

    const findCountry = ()=> data.value.defaultCountryValue = store.countries.find(c => c.id === store.countryId)
    const findCity = ()=> data.value.defaultCityValue = store.cities.find(c => c.id === store.cityId)

    watch(()=> store.countryId, ()=> {
        findCountry()
    })

    watch(()=> store.countries, (newSate)=> {
        findCountry()
    })

    watch(()=> store.cityId, (newSate)=> {
        findCity()
    })

    watch(()=> store.cities, (newSate)=> {
        findCity()
    })

    onMounted(()=> {
        findCountry()
        findCity()
    })
</script>

<template>
    <CustomSelect
        :options="store.countries"
        :defaultValue="data.defaultCountryValue"
        :className="'popup-select'"
        :isDisabled="!store.isReady"
        :placeholder="'Выбрать страну'"
        @onChange="changeCountry"
    />

    <CustomSelect
        :options="store.cities"
        :defaultValue="data.defaultCityValue"
        :className="'popup-select'"
        :isDisabled="!store.isReady"
        :placeholder="'Выбрать город'"
        @onChange="changeCity"
    />
</template>

<style scoped lang="scss">
.popup-select {
    width: 100%;

    &:not(:last-child) {
        margin-bottom: 10px;
    }
}
</style>
