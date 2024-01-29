<script setup lang="ts">
    import {defineEmits, defineProps, watch, ref, toRefs} from 'vue'
    import {useClickOutside} from './useClickOutside'

    interface Props {
        placeholder: string
        isDisabled?: boolean,
        options: SelectOption[]
        className?: string,
        defaultValue?: SelectOption,
    }

    interface Emits {
        onChange: [v: SelectOption]
    }

    const props = defineProps<Props>()
    const data = toRefs(props)
    const emit = defineEmits<Emits>()
    const isDropdownOpen = ref(false)
    const select = ref()
    const selectedOption = ref<SelectOption | null>(null)
    useClickOutside(select, ()=> isDropdownOpen.value = false)

    const toggleDropdown = ()=> {
        if (data.isDisabled.value) return
        isDropdownOpen.value = !isDropdownOpen.value;
    }

    const selectOption = (option: SelectOption)=> {
        selectedOption.value = option
        isDropdownOpen.value = false
        emit('onChange', option)
    }

    watch(props, (newState)=> {
        console.log(3333)
        selectedOption.value = newState.defaultValue
    })
</script>

<template>
    <div ref="select" :class="className" class="select">
        <div @click="toggleDropdown" :class="{ is_open: isDropdownOpen }" class="select__field">
            <div
                v-if="!selectedOption"
                :class="{ is_open: isDropdownOpen }"
                class="select__placeholder"
            >
                {{ placeholder }}
            </div>
            <div v-else class="select__selected">
                {{ selectedOption.value }}
            </div>
            <i :class="{ 'is_open': isDropdownOpen }" class="select__arrow">
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
                    :class="{is_active: selectedOption === option.value}"
                >
                    <span>{{ option.value }}</span>
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
