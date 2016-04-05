import ticker from 'ticker'

import './state.js'

import Config from './config.js'
import MobileManager from './mobile-manager.js'
import CanvasManager from './canvas-manager.js'

const state = window.state

class App {

	constructor() {

		

		this.canvasManager = new CanvasManager()
		this.mobileManager = new MobileManager()

		ticker(window, 50).on('tick', this.draw.bind(this))
	}

	draw() {
		this.canvasManager.render()
	}

}

window.app = new App()