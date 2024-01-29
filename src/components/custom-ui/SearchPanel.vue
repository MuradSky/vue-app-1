<script setup lang="ts">
    import { ref, watch, } from 'vue'
    import {useClickOutside} from './useClickOutside'
    import {store} from '../../store'

    const searchRef = ref()
    const isFocused = ref(false)
    useClickOutside(searchRef, ()=> isFocused.value = false)
    const data = ref({
        searchByCity: '',
        hints:[],
        filteredItems: [],
    })
    const filteredItems = ref([])

    const selectedCity = (id: number, name: string)=> {
        isFocused.value = false
        data.value.searchByCity = name
        store.selectGeoPointId = id
    }

    const highlightText = (text: string)=> {
        if (!data.value.searchByCity) {
            return text;
        }

        const query = data.value.searchByCity.toLowerCase();
        const index = text.toLowerCase().indexOf(query);

        if (index !== -1) {
            const before = text.slice(0, index);
            const highlighted = text.slice(index, index + query.length);
            const after = text.slice(index + query.length);

            return `${before}<span class="highlight">${highlighted}</span>${after}`;
        }

        return text;
    }

    const filtered = (value)=> {
        if (!value) {
            return filteredItems.value = data.value.hints
        }

        const query = value.toLowerCase()
        filteredItems.value = data.value.hints.filter((item) => {
            if (item.address?.toLowerCase().includes(query)) {
                return item
            }
            if (item.name.toLowerCase().includes(query)) {
                return item
            }
        })
    }


    watch(()=> store.hints.data, (newState)=> {
        data.value.hints = newState
        filteredItems.value = newState
        data.value.searchByCity = ''
    })

    watch(()=> store.selectGeoPointId, (newState)=> {
       if (newState !== null) {
           const hint = store.hints.data.find(d => d.id === newState)
           data.value.searchByCity = hint.name
       }
    })

    watch(()=> data.value.searchByCity, (newState)=> {
        filtered(newState)
        if (newState === '') {
            store.selectGeoPointId = null
        }
    })
</script>

<template>
    <div class="search" ref="searchRef">
        <label class="search__input">
            <div class="search__icon" :class="{ is_focus: isFocused }">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.9666 15.9661L22.4001 22.3996M18.1434 9.87124C18.1434 5.30294 14.44 1.59961 9.87172 1.59961C5.30343 1.59961 1.6001 5.30294 1.6001 9.87124C1.6001 14.4395 5.30343 18.1429 9.87172 18.1429C14.44 18.1429 18.1434 14.4395 18.1434 9.87124Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <input
                type="text"
                name="searchByCity"
                v-model="data.searchByCity"
                placeholder="Поиск по городам"
                @focus="isFocused=true"
                :disabled="store.hints.isLoading || !store.isReady"
            >
            <div class="search__icon" :style="{opacity: data.searchByCity.length > 0 ? 1 : 0}" data-clear @click="data.searchByCity=''">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.86957 21.0696C1.57668 21.3625 1.57668 21.8374 1.86957 22.1303C2.16247 22.4232 2.63734 22.4232 2.93023 22.1303L1.86957 21.0696ZM11.9302 13.1303C12.2231 12.8374 12.2231 12.3625 11.9302 12.0696C11.6373 11.7768 11.1625 11.7768 10.8696 12.0696L11.9302 13.1303ZM10.8696 12.0696C10.5767 12.3625 10.5767 12.8374 10.8696 13.1303C11.1625 13.4232 11.6373 13.4232 11.9302 13.1303L10.8696 12.0696ZM20.9302 4.13031C21.2231 3.83741 21.2231 3.36254 20.9302 3.06965C20.6373 2.77675 20.1625 2.77675 19.8696 3.06965L20.9302 4.13031ZM11.9302 12.0696C11.6373 11.7768 11.1625 11.7768 10.8696 12.0696C10.5767 12.3625 10.5767 12.8374 10.8696 13.1303L11.9302 12.0696ZM19.8696 22.1303C20.1625 22.4232 20.6373 22.4232 20.9302 22.1303C21.2231 21.8374 21.2231 21.3625 20.9302 21.0696L19.8696 22.1303ZM10.8696 13.1303C11.1625 13.4232 11.6373 13.4232 11.9302 13.1303C12.2231 12.8374 12.2231 12.3625 11.9302 12.0696L10.8696 13.1303ZM2.93023 3.06965C2.63734 2.77675 2.16247 2.77675 1.86957 3.06965C1.57668 3.36254 1.57668 3.83741 1.86957 4.13031L2.93023 3.06965ZM2.93023 22.1303L11.9302 13.1303L10.8696 12.0696L1.86957 21.0696L2.93023 22.1303ZM11.9302 13.1303L20.9302 4.13031L19.8696 3.06965L10.8696 12.0696L11.9302 13.1303ZM10.8696 13.1303L19.8696 22.1303L20.9302 21.0696L11.9302 12.0696L10.8696 13.1303ZM11.9302 12.0696L2.93023 3.06965L1.86957 4.13031L10.8696 13.1303L11.9302 12.0696Z" fill="#233440"/>
                </svg>
            </div>
        </label>

        <div class="dropdown" v-if="isFocused" >
            <ul class="dropdown__list" :class="{ is_disabled: store.hints.isLoading }">
                <div v-if="filteredItems.length === 0">{{ data.searchByCity }}</div>
                <li
                    v-for="hint in filteredItems"
                    class="dropdown__list-item"
                    :class="{ is_active: hint.id === store.selectGeoPointId }"
                    @click="selectedCity(hint.id, hint.name)"
                >
                    <div class="dropdown__list-link">
                        <span class="dropdown__list-address" v-html="highlightText(hint.name)" />
                        <span class="dropdown__list-desc" v-if="hint.address" v-html="highlightText(hint.address)" />
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .search {
        position: relative;

        &__icon {
            cursor: pointer;
            position: absolute;
            top: 50%;
            left: 12px;
            transform: translate(0, -50%);

            width: 24px;
            height: 24px;
            color: #009BDC;
            transition: color .3s linear;
            &.is_focus {
                color: #233440;
            }

            svg {
                width: 24px;
                height: 24px;
            }

            &[data-clear] {
                left: auto;
                right: 12px;
            }
        }

        &__input {
            position: relative;
            &:hover {
                input {
                    color: #020813;
                    border-color: #9FA7B6;
                }
            }

            input {
                font-size: 14px;
                line-height: 100%;
                color: rgba(2, 8, 19, 0.70);
                transition: color .3s linear, border .3s linear, border-radius .3s linear, background-color .3s linear;

                width: 100%;
                height: 48px;
                padding: 17px 17px 17px 48px;


                border-radius: 6px;

                border: 1px solid #DEDEDE;
                background-color: #FAFAFA;

                &:focus {
                    border-radius: 0;
                    border-color: transparent;
                    color: #020813;
                    background-color: #fff;
                    border-bottom-color: #9FA7B6;
                }
            }
        }
    }

    .dropdown {

        position: absolute;
        top: calc(100% + 5px);
        left: 50%;
        width: 96%;
        transform: translateX(-50%);
        padding: 25px 17px;
        border-radius: 6px;
        box-shadow: 0px 10px 20px 0px rgba(2, 8, 19, 0.10);
        background: #fff;
        max-height: 284px;
        overflow: hidden;
        overflow-y: auto;
        z-index: 200;

        &::-webkit-scrollbar {
            width: 2px;
        }

        &::-webkit-scrollbar-track {
            background-color: #fff;
        }

        &::-webkit-scrollbar-thumb {
            background-color: #bebec0;
        }


        &__list-item {
            &:not(:last-child) {
                margin-bottom: 18px;
            }

            &.is_active {
                .dropdown__list-address {
                    color: #0057BE;
                }
            }
        }

        &__list-link {
            cursor: pointer;
            &:hover {
                .dropdown__list-address {
                    color: #00adf6;
                }
            }
            color: #020813;
            .highlight {
                font-weight: 700;
            }
        }

        &__list-address {
            font-size: 14px;
            line-height: 120%;
            color: #020813;
            display: block;
            margin-bottom: 6px;
            transition: color .3s linear;
        }

        &__list-desc {
            font-size: 12px;
            line-height: 120%;
            color: #9FA7B6;
        }
    }
</style>
