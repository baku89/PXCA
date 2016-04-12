import ticker from 'ticker'

/*
import Config from './config.js'

import Mobile from './mobile.js'


*/

import Navigation from './navigation.js'
import Home from './home.js'
import Gallery from './gallery.js'
import Canvas from './canvas.js'
import Systems from './systems.js'


const initialState = window.initialState
const state = window.state

export default class App {

	constructor() {

		this.$home = new Home()
		this.canvas = new Canvas()
		this.gallery = new Gallery()

		this.navigation = new Navigation()

		state.onenterdraw = () => {
			this.isDraw = true
		}
		state.onleavedraw = () => {
			this.isDraw = false
		}

		document.oncontextmenu = () => false

		state.init()

		ticker(window, 50).on('tick', this.draw.bind(this))
		
	}

	draw() {
		this.canvas.render(this.isDraw)
	}
}