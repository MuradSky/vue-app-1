<script setup lang="ts">
    import {ref} from 'vue'
    import SwitchButtons from './SwitchButtons.vue'
    import CustomMultiSelect from './custom-ui/CustomMultiSelect.vue'
    import CountryRadios from './CountryRadios.vue'
    import CitiesTab from './CitiesTab.vue'
    import SearchPanel from './custom-ui/SearchPanel.vue'
    import Popup from './Popup.vue'
    import Map from './YMap/Map.vue'
    import {useMatchMedia} from '../hooks/useMatchMedia'
    import {store} from '../store'

    //Data
    const isSmallScreen = useMatchMedia('(max-width: 768px)')
    const isMapContent = ref(true)
    const countries = [
        { label: "Филиалы", id: 1, value: "branches" },
        { label: "Региональные торговые представители", id: 2, value: "regional-sales-representatives" },
        { label: "Магазины розничной сети ТракСервис", id: 3, value: "track-service-retail-chain-stores" },
        { label: "Адреса магазинов в других регионах", id: 4, value: "store-addresses-in-other-regions" },
    ]

    //Methods
    const changeMapContent = (value: boolean)=> isMapContent.value = value
    const selectByTypes = (options: SelectOption[])=> {
        store.filterByTypesValues = options.map(opt => opt.value)
    }
</script>

<template>
    <div class="app">
        <div class="container" v-if="!isSmallScreen">
            <div class="app__head">
                <CountryRadios />
                <div class="app__head-select">
                    <CustomMultiSelect
                        :options="countries"
                        :placeholder="'Тип, магазин, филиал'"
                        :isDisabled="!store.isReady"
                        @onChange="selectByTypes"
                    />
                </div>

                <SwitchButtons
                    :isMapContent="isMapContent"
                    @changeMapContent="changeMapContent"
                />
            </div>

            <CitiesTab />

            <SearchPanel />
        </div>

        <div class="app__block" v-if="isMapContent">
            <Popup v-if="!isSmallScreen" />
            <Map />
        </div>
    </div>
</template>

<style scoped lang="scss">
    .app {
        padding: 60px 0;

        &__head {
            display: flex;
            align-items: center;
            margin-bottom: 24px;

            @media (max-width: 768px) {
                display: block;
                margin-bottom: 20px;
                .dealer-map__select {
                    width: 100%;
                }
            }
        }


        &__head-select {
            margin-left: auto;
            width: 100%;
            max-width: 300px;
        }

        &__block {
            position: relative;
            margin-top: 40px;
            height: 660px;

            @media (max-width: 768px) {
                margin-top: 0;
            }

            &-over {
                position: absolute;
                padding: 10px 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 100;
            }
        }
    }
</style>
