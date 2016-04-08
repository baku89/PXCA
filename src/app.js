import ticker from 'ticker'

import './router.js'
import Config from './config.js'
import Navigation from './navigation.js'
import Mobile from './mobile.js'
import CanvasManager from './canvas-manager.js'
import GalleryManager from './gallery-manager.js'

import Systems from './systems.js'

const state = window.state
const router = window.router

export default class App {

	constructor() {

		this.canvasManager = new CanvasManager()
		this.canvasManager.initSystem(Systems[1])

		this.galleryManager = new GalleryManager()

		this.navigation = new Navigation()
		this.navigation.on('clear', this.onClear.bind(this))

		state.onenterdraw = () => {
			this.isDraw = true
		}
		state.onleavedraw = () => {
			this.isDraw = false
		}

		document.oncontextmenu = () => false

		// routing
		router.init()

		ticker(window, 50).on('tick', this.draw.bind(this))
	}

	onClear() {
		this.canvasManager.clear()
	}

	draw() {
		this.canvasManager.render(this.isDraw)
	}
}