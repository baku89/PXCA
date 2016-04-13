import ticker from 'ticker'

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
		state.onenterhome = () => {
			this.playTicker = false
		}
		state.onlevehome = () => {
			this.playTicker = true
		}

		document.oncontextmenu = () => false

		state.init()

		ticker($('#canvas')[0], 50).on('tick', this.draw.bind(this))
		
	}

	draw() {
		this.canvas.render(this.isDraw)
	}
}