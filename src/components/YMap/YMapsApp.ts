const pinTemplate = `
    <button class="pin-icon ymaps-custom-pin-icon">
        <svg width="44" height="57" viewBox="0 0 44 57" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.0001 5.77326e-08C17.6487 -0.000316304 13.3949 1.29956 9.77676 3.73525C6.15858 6.17093 3.33854 9.63301 1.67328 13.6836C0.00802542 17.7343 -0.42765 22.1915 0.421356 26.4916C1.27036 30.7917 3.36591 34.7416 6.44299 37.8417C10.4344 41.8633 19.8001 47.6583 20.3344 53.77C20.4287 54.6567 21.0887 55.4167 22.0001 55.4167C22.9116 55.4167 23.5716 54.6567 23.6658 53.77C24.2001 47.6583 33.5658 41.8633 37.5573 37.8417C40.6343 34.7416 42.7299 30.7917 43.5789 26.4916C44.4279 22.1915 43.9922 17.7343 42.327 13.6836C40.6617 9.63301 37.8417 6.17093 34.2235 3.73525C30.6053 1.29956 26.3516 -0.000316304 22.0001 5.77326e-08Z" fill="currentColor"/>
            <path d="M21.9998 29.925C23.011 29.925 24.0123 29.7243 24.9465 29.3344C25.8807 28.9445 26.7295 28.3731 27.4445 27.6526C28.1595 26.9322 28.7267 26.0769 29.1137 25.1356C29.5006 24.1944 29.6998 23.1855 29.6998 22.1667C29.6998 21.1478 29.5006 20.139 29.1137 19.1977C28.7267 18.2564 28.1595 17.4011 27.4445 16.6807C26.7295 15.9603 25.8807 15.3888 24.9465 14.9989C24.0123 14.609 23.011 14.4083 21.9998 14.4083C19.9576 14.4083 17.9991 15.2257 16.5551 16.6807C15.1111 18.1357 14.2998 20.109 14.2998 22.1667C14.2998 24.2243 15.1111 26.1977 16.5551 27.6526C17.9991 29.1076 19.9576 29.925 21.9998 29.925Z" fill="#fff"/>
        </svg>
    </button>
`
const balloonTemplate = `
    <div class="balloon-content">
        <div class="balloon-content__img">
            <picture>
                <img src="{{ image_url }}" alt="" width="346" height="140">
            </picture>
        </div>
        <div class="balloon-content__title">{{ name }}</div>
        <div class="balloon-content__phone">
        
            <a href="tel:{{ phone }}">{{ phone }}</a>
        </div>
        
        {%if address %}
            <div class="balloon-content__address">
                {{ address }}
            </div>
        {% endif %}
        
        <div class="balloon-content__time">
            {{ time }}
        </div>
        {%if email %}
            <a href="mailto:{{ email }}" class="balloon-content__email">
                {{ email }}
            </a>
        {% endif %}
        <div class="balloon-content__buttons">
            <a href="{{ page_link }}" class="button">Подробнее</a>
            <a href="{{ map_route }}" class="balloon-content__route" target="_blank">
                Проложить маршрут
                <svg width="12" height="12">
                    <use xlink:href="./img/sprites/sprite.svg#arrow-right2"></use>
                </svg>
            </a>
        </div>
    </div>
`

const createObjectsData = (hintsData, cb)=> {
	const geoData = []
	hintsData?.map(async (data, i, arr)=> {
		const coords = await ymaps.geocode(data?.address || data?.name).then(res => {
			return res.geoObjects.get(0).geometry.getCoordinates()
		})

		geoData.push({
			"type": "Feature",
			"id": data.id,
			"geometry": {
				"type": "Point",
				"coordinates": coords
			},
			"properties": null,
			"options": null,
		})
		if (arr.length === geoData.length) {
			cb({
				"type": "FeatureCollection",
				"features": geoData
			})
		}
	})
}

export const YMapsApp = {
	appMap: null,
	objectManager: null,
	hintsData: [],
	vueStore: null,
	vueWatch: null,

	ready(props, callBack) {
		const { container, cityName, hints } = props
		ymaps.ready(()=> {
			createObjectsData(hints, (geoData)=> {
				YMapsApp.hintsData = hints
				ymaps.geocode(cityName).then(res => {
					const coordinates = res.geoObjects.get(0).geometry.getCoordinates()
					this.init(container, geoData, coordinates)
					callBack()
				})
			})
		})
	},

	init(container, geoData, center) {
		this.appMap = new ymaps.Map(`${container}`, {
			center,
			zoom: 8,
			controls: ['zoomControl',  'trafficControl']
		})

		this.objectManager = new ymaps.ObjectManager({
			clusterize: true,
			geoObjectOpenBalloonOnClick: false,
			clusterOpenBalloonOnClick: false,
			gridSize: 32,
		});

		this.objectManager.objects.options.set(this.pointDraw());
		this.appMap.geoObjects.add(this.objectManager);
		this.objectManager.add(geoData)
		this.appMap.behaviors.disable('scrollZoom');

		this.updateHints()
		this.listeners()
	},
	updateByFilteredType(newData) {
		this.hintsData = newData
		if (this.objectManager) {
			createObjectsData(newData, (geoData)=> {
				this.objectManager.removeAll()
				this.objectManager.add(geoData)
			})
		}
	},
	updateHints(cityName?: string) {
		if (this.appMap) {
			ymaps.geocode(cityName).then(async res => {
				const coordinates = res.geoObjects.get(0).geometry.getCoordinates()
				this.appMap.panTo(coordinates)
				this.appMap.balloon.close()
			})
		}
	},
	listeners(callBack) {
		let OBJECT_ID = null
		const {
			appMap,
			objectManager,
			pointDrawPin,
			pointDraw,
			toggleZIndexByPin,
			renderBalloonContent,
		} = this

		const reset = (objectId)=> {
			if (OBJECT_ID !== null && OBJECT_ID !== objectId) {
				appMap.balloon.close()
				toggleZIndexByPin(false)
				objectManager.objects.setObjectOptions(OBJECT_ID, pointDraw())
				OBJECT_ID = null
			}
		}

		const selectPointById = (objetId)=> {
			if (objetId === null) return reset()
			const { geometry: { coordinates } } = objectManager.objects.getById(objetId)
			reset(objetId)

			if (OBJECT_ID === objetId) {
				appMap.balloon.open(coordinates, renderBalloonContent(objetId))
				setTimeout(()=> appMap.panTo(coordinates), 0)
				return
			}

			if (OBJECT_ID !== objetId) {
				OBJECT_ID = objetId
				appMap.panTo(coordinates)
				objectManager.objects.setObjectOptions(objetId, pointDrawPin())
				toggleZIndexByPin(true)
			}
		}

		appMap.events.add('click', ()=> {
			reset()
			callBack && callBack(null)
		})

		appMap.balloon.events.add('open', ()=> {
			document.querySelector('.ymaps-custom-pin-icon')?.classList?.add('_is_active')
		})
		appMap.balloon.events.add('close', ()=> {
			document.querySelector('.ymaps-custom-pin-icon')?.classList?.remove('_is_active')
		})

		objectManager.objects.events.add(['mouseenter', 'mouseleave'], (event)=> {
			const objetId = event.get('objectId')
			if (event.get('type') == 'mouseenter' && OBJECT_ID === objetId) {
				document.querySelector('.ymaps-custom-pin-icon')?.classList?.add('_is_hover')
			} else {
				document.querySelector('.ymaps-custom-pin-icon')?.classList?.remove('_is_hover')
			}
		})


		objectManager.objects.events.add('click', (event)=> {
			const objetId = event.get('objectId')
			callBack && callBack(objetId)
			selectPointById(objetId)
		})

		return { selectPointById }
	},

	renderBalloonContent(objectId) {
		const balloonContent = YMapsApp.hintsData.find(hint => hint.id === objectId)
		const data = new ymaps.data.Manager(balloonContent)
		const template = new ymaps.Template(balloonTemplate)
		const result = template.build(data)
		return result.text
	},

	pointDrawPin() {
		const iconLayout = ymaps.templateLayoutFactory.createClass(pinTemplate)

		return {
			iconLayout,
			iconImageSize: [44, 57],
			iconShape: {
				type: 'Rectangle',
				coordinates: [
					[-22, -60], [22, 0]
				],
			}
		}
	},
	pointDraw() {
		return ({
			iconLayout: 'default#image',
			iconImageHref: 'src/assets/image/map/circle-pin.png',
			iconImageSize: [36, 36],
		})
	},

	toggleZIndexByPin(toggle) {
		const method = toggle ? 'add' : 'remove'
		document.querySelector('.ymaps-custom-pin-icon')
			?.closest('.ymaps-2-1-79-placemark-overlay')
			?.classList[method]('_zIndex_over')
	},
}
