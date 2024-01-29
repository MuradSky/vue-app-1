<script setup lang="ts">
    import {onMounted, onBeforeMount, onBeforeUnmount, ref, watch} from 'vue'
    import {YMapsApp} from './YMapsApp'
    import {store} from '../../store'

    const yandexMap = ref()

    const storeWatchers = ()=> {
        const { selectPointById } = YMapsApp.listeners(value=> store.selectGeoPointId = value)
        watch(()=> store.hints.data, (newData)=> {
            YMapsApp.updateByFilteredType(newData)
        })

        watch(()=> store.cityId, (newState)=> {
            const cityName = store.cities.find(c => c.id === newState).value
            YMapsApp.updateHints(cityName)
        })

        watch(()=> store?.selectGeoPointId, (newState)=> {
            selectPointById(newState)
        })
    }

    const initYandexMap = ()=> {
        if (yandexMap && window.ymaps) {
            const container = yandexMap.value.id
            const props = {
                container,
                cityName: store.cities.find(c => c.id === store.cityId).value,
                hints: store.hints.data
            }

            YMapsApp.ready(props, ()=> {
                storeWatchers()
                store.isReady = true
            })
        }
    }

    onMounted(()=> {
        if (store.isReady) initYandexMap()
    })

    onBeforeMount(()=> {
        if (store.isReady) return
        const setterYmapsApi = ()=> {
            const script = document.createElement('script')
            script.src = 'https://api-maps.yandex.ru/2.1/?apikey=28517946-dbf1-42a5-9b36-08632da36a93&lang=ru_RU'
            script.id = 'ymaps-api-src'
            script.onload = function () {
                initYandexMap()
            }

            document.body.prepend(script)
        }
        setterYmapsApi()
    })
</script>

<template>
    <div
        class="ymap-app"
        id="dealer-map-map"
        ref="yandexMap"
    />
</template>


<style lang="scss">
    .ymap-app {
        width: 100%;
        height: 100%;

        .ymaps-2-1-79-svg-icon-content  {
            position: absolute;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;

            display: flex;
            align-items: center;
            justify-content: center;
        }
        .ymaps-2-1-79-svg-icon {
            position: relative;
            color: #fff;
            font-size: 16px;
            font-weight: 700;
            line-height: 120%;
            width: 35px !important;
            height: 35px !important;
            background: #009BDC;
            border: 1px solid rgba(0, 87, 190, 0.30);
            box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.20);
            border-radius: 50%;
        }

        .pin-icon {
            position: absolute;
            top: -70px;
            left: -14px;
            z-index: 100000000000000;
            color: #009bdc;
            display: block;
            &._is_hover,
            &._is_active {
                color: #0057BE;
            }
        }

        .ymaps-2-1-79-placemark-overlay {
            &._zIndex_over {
                z-index: 800 !important;
            }
        }

        .ymaps-2-1-79-balloon {
            transform: translate(110px, 25%);
            box-shadow: 0px 10px 20px 0px rgba(2, 8, 19, 0.10);
            //
            //@include below(768px) {
            //    top: auto !important;
            //    left: 0 !important;
            //    right: 0 !important;
            //    bottom: 0;
            //    transform: translate(0, 0);
            //}
        }

        .ymaps-2-1-79-copyrights-pane {
            //@include below(768px) {
            //    display: none;
            //}
        }

        .ymaps-2-1-79-balloon-pane {
            //@include below(768px) {
            //    transform: translate(0, 0) !important;
            //}
        }

        .ymaps-2-1-79-balloon-overlay {
            //@include below(768px) {
            //    background-color: rgba(#000, .3);
            //    display: block;
            //    width: 100vw !important;
            //    height: 100% !important;
            //    top: auto !important;
            //    left: 0 !important;
            //    right: 0 !important;
            //    min-height: 470px;
            //}
        }

        .ymaps-2-1-79-balloon__close-button {
            //@include below(768px) {
            //    margin-right: 30px;
            //}
            //
            //@include below(363px) {
            //    margin-right: 10px;
            //}
        }

        .ymaps-2-1-79-balloon_to_to .ymaps-2-1-79-balloon__tail {
            transform: translate(0) rotate(0);
        }

        .ymaps-2-1-79-balloon__content {
            margin: 0 !important;
            padding: 0;

            & > ymaps {
                padding: 0 !important;
                overflow: visible !important;
                height: auto !important;
            }
        }

        .ymaps-2-1-79-balloon__tail {
            position: absolute;
            top: initial;
            bottom: 30%;
            left: -15px;
            width: 32px;
            height: 32px;
            box-shadow: 0px 10px 20px 0px rgba(2, 8, 19, 0.10);
            &:after {
                width: 100%;
                height: 100%;
            }
        }

        .ymaps-2-1-79-controls__control {
            left: auto !important;
            right: 15px !important;
        }

        .balloon-content {
            padding: 30px;
            //@include below(768px) {
            //    padding: 30px 15px;
            //}

            &__img {
                width: 100%;
                height: 140px;
                margin-bottom: 20px;

                //@include below(768px) {
                //    display: none;
                //}

                img {
                    height: 100%;
                    object-fit: cover;
                }
            }

            &__title {
                font-size: 16px;
                font-weight: 700;
                line-height: 100%;
                margin-bottom: 20px;

                //@include below(768px) {
                //    margin-bottom: 12px;
                //}
            }

            &__phone {
                font-weight: 700;
                color: #020813;
                a {
                    color: #020813;
                }
                &:hover {
                    text-decoration: underline;
                }
            }

            &__address,
            &__phone,
            &__time {
                display: flex;
                align-items: flex-start;
                font-size: 12px;
                margin-bottom: 16px;

                //@include below(768px) {
                //    margin-bottom: 8px;
                //}

                svg {
                    color: #9fa7b6;
                    min-width: 14px;
                    height: 14px;
                    margin-right: 6px;

                    //@include below(768px) {
                    //    min-width: 12px;
                    //    height: 12px;
                    //    margin-right: 4px;
                    //    margin-top: 4px;
                    //}

                }
            }

            &__email {
                font-size: 12px;
                line-height: 100%;
                text-decoration-line: underline;
                color: #009bdc;
                display: inline-block;
                margin-bottom: 20px;
            }

            &__buttons {
                display: flex;
                align-items: center;
                justify-content: space-between;

                //@include below(768px) {
                //    align-items: flex-start;
                //    flex-direction: column-reverse;
                //}
                //
                //.button {
                //    max-width: 150px;
                //    @include below(768px) {
                //        margin-top: 10px;
                //    }
                //}
            }

            &__route {
                display: flex;
                align-items: center;
                font-size: 16px;
                text-decoration-line: underline;
                font-weight: 500;
                color: #233440;
                svg {
                    min-width: 14px;
                    width: 14px;
                    height: 14px;
                    margin-left: 6px;
                }
            }
        }
    }
</style>
