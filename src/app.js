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

		state.onleavedraw = () => this.isPause = true
		state.onenterdraw = () => this.isPause = false

		// routing
		let id = (function() {
			let result = new RegExp(/^\?n=([0-9]+)$/).exec(location.search)
			if (result) return result[1]
			else null
		})()

		if (id) {
			// this.canvasManager.loadMap(id)
			state.assetsLoaded()

		} else {
			state.assetsLoaded()
		}

	}

	draw() {
		if (!this.isPause) 
			this.canvasManager.render()
	}

}

window.app = new App()