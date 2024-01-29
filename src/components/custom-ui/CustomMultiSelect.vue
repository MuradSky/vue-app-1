<script setup lang="ts">
    import {defineEmits, defineProps, ref, toRefs, watch} from 'vue'
    import {useClickOutside} from './useClickOutside'

    interface Props {
        placeholder: string,
        options: SelectOption[],
        isDisabled?: boolean,
    }

    interface Emits {
        onChange: [v: SelectOption[]]
    }

    const props = defineProps<Props>()
    const { isDisabled } = toRefs(props)

    const emit = defineEmits<Emits>()
    const select = ref()
    const isDropdownOpen = ref(false)
    useClickOutside(select, ()=> isDropdownOpen.value = false)

    const selectedOptions = ref([])

    const toggleDropdown = ()=> {
        if (isDisabled.value) return
        isDropdownOpen.value = !isDropdownOpen.value;
    }

    const selectOption = (option: SelectOption)=> {
        const hasSelected = selectedOptions.value.find((selected) => selected.value === option.value)
        if (!hasSelected) {
            const cloneArr = [...selectedOptions.value, option]
            selectedOptions.value = cloneArr.sort((a, b) => a.id - b.id)
        } else {
            selectedOptions.value = selectedOptions.value.filter(selected => selected.value !== option.value)
        }
    }

    watch(()=> selectedOptions.value, (newState)=> {
        emit('onChange', newState)
    })
</script>

<template>
    <div ref="select" class="select">
        <div @click="toggleDropdown" :class="{ is_open: isDropdownOpen }" class="select__field">
            <div v-if="selectedOptions.length === 0" :class="{ is_open: isDropdownOpen }" class="select__placeholder">
                {{ placeholder }}
            </div>
            <div class="select__selected">
                {{ selectedOptions.map(v => v.label).join(' , ') }}
            </div>
            <i class="select__arrow" :class="{ 'is_open': isDropdownOpen }">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.55229 10.197C7.24742 10.5059 6.75313 10.5059 6.44827 10.197L2.08764 5.77895C1.59585 5.28068 1.94415 4.42871 2.63965 4.42871L11.3609 4.42871C12.0564 4.42871 12.4047 5.28068 11.9129 5.77895L7.55229 10.197Z" fill="currentColor"/>
                </svg>
            </i>
        </div>

        <div v-if="isDropdownOpen" class="dropdown">
            <ul class="dropdown__list">
                <li
                    v-for="option in options"
                    :key="option.id"
                    @click="selectOption(option)"
                    :class="{is_active: selectedOptions.findIndex(e => e.value === option.value) !== -1}"
                >
                    <i>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 6.00001L4.33368 9.57156L11.0003 2.42847" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </i>
                    <span>{{ option.label }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .select {
        cursor: pointer;
        position: relative;
        width: 300px;

        &__field {
            cursor: pointer;
        }

        &__arrow {
            width: 14px;
            height: 14px;
            margin-left: 10px;
            color: #9FA7B6;
            transition: color .3s linear;

            &.is_open {
                color: #233440;

                svg {
                    transform: rotate(180deg);
                }
            }

            svg {
                width: 14px;
                height: 14px;
                transition: transform .3s linear;
            }
        }

        &__field {
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            padding: 17px;
            border-radius: 6px;
            border: 1px solid #DEDEDE;
            background: #FAFAFA;
            transition: border .3s linear;
            overflow: hidden;
            text-overflow: ellipsis;
            &.is_open,
            &:hover {
                border-color: #233440;

                .dealer-map__select-arrow {
                    color: #233440;
                }
            }
        }

        &__selected {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            font-size: 14px;
            line-height: 100%;
            color: #020813;

            //padding: 5px 10px;
            //margin: 5px;
            //display: flex;
            //align-items: center;

            span {
                margin-left: 5px;
                cursor: pointer;
            }
        }

        &__placeholder {
            font-size: 14px;
            line-height: 100%;
            color: #9FA7B6;
            transition: color .3s linear;
            &.is_open {
                color: #233440;
            }
        }


    }
    .dropdown {
        position: absolute;
        top: calc(100% + 5px);
        left: 0;
        width: 100%;
        background-color: #fff;
        z-index: 1;

        margin: 10px 0;
        min-height: 200px;
        max-height: 200px;

        overflow: hidden;
        overflow-y: auto;

        border-radius: 10px;
        box-shadow: 0px 10px 20px 0px rgba(2, 8, 19, 0.10);


        &::-webkit-scrollbar {
            width: 2px;
        }

        &::-webkit-scrollbar-track {
            background-color: #fff;
        }

        &::-webkit-scrollbar-thumb {
            background-color: #E8E8E9;
        }

        &__list {
            list-style: none;
            padding: 0;
            margin: 0;

            li {
                padding: 10px 17px;
                cursor: pointer;
                display: flex;
                align-items: center;

                i {
                    width: 20px;
                    min-width: 20px;
                    height: 20px;
                    border-radius: 3px;
                    border: 1px solid #9FA7B6;
                    margin-right: 10px;

                    transition: border .3s linear, background-color .3s linear;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    svg {
                        color: #009BDC;
                        width: 12px;
                        height: 12px;
                        opacity: 0;
                        transition: opacity .3s linear;
                    }
                }

                span {
                    font-size: 14px;
                    line-height: 110%;
                    color: #020813;
                }

                &.is_active {
                    i {
                        border-color: rgba(#009BDC, 1);
                        background-color: rgba(#009BDC, 1)
                    }

                    i svg {
                        color: #fff;
                        opacity: 1;
                    }
                }

                &:hover:not(.is_active) {
                    background-color: rgba(#e9e9e9, .2);

                    i {
                        border-color: rgba(#009BDC, .5);
                    }

                    i svg {
                        opacity: .5;
                    }
                }
            }
        }
    }
</style>
