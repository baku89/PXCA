import ticker from 'ticker'

import './state.js'

import Config from './config.js'
import Navigation from './navigation.js'
import MobileManager from './mobile-manager.js'
import CanvasManager from './canvas-manager.js'

import FuseSystem from './systems/fuse/fuse-system.js'

const state = window.state

class App {

	constructor() {

		this.canvasManager = new CanvasManager()
		this.canvasManager.initSystem(FuseSystem)

		this.mobileManager = new MobileManager()

		this.navigation = new Navigation()
		this.navigation.on('clear', this.canvasManager.clear)

		ticker(window, 50).on('tick', this.draw.bind(this))

		state.onleavedraw = () => this.isPaused = true
		state.onenterdraw = () => this.isPaused = false

		// routing
		let id = parseInt( $('body').data('id') )

		if (id) {
			let mapUrl = $('body').data('map')

			this.canvasManager.loadMap(mapUrl).then(() => {
				state.mapLoaded()
			})

		} else {
			state.resume()

		}

	}

	draw() {
		if (!this.isPaused) 
			this.canvasManager.render()
	}
}

window.app = new App()