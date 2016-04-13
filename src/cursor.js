import Config from './config.js'
import EventEmitter from 'eventemitter3'
import Mobile from './mobile.js'

const BUTTON_RIGHT = 2

const router = window.router

const Mode = {
	NONE: 0,
	DRAW: 1,
	SIZING: 2
}

export default class Cursor extends EventEmitter {

	constructor() {
		super()

		this.$region = $('.canvas')

		// public
		this.curtPos = new THREE.Vector2()
		this.prevPos = new THREE.Vector2()

		// private
		this.coord = new THREE.Vector2()
		this.mode = Mode.NONE
		// this.mode = Mode.none

		this.isPortrait = Mobile.getOrientation() == 'portrait'

		Mobile.on('orientationchange', (orientation) => {
			this.isPortrait = orientation == 'portrait'
		})

		this.$region.on({

			'mousedown': (e) => {
				if (e.button == 2) {
					this.mode = Mode.SIZING
					this.sx = e.clientX / Config.CELL_WIDTH
					this.sy = e.clientY / Config.CELL_WIDTH
					
				} else {
					this.mode = Mode.DRAW
					this.updateCoord(e.clientX, e.clientY, true)
				}
				
			},

			'mousemove': (e) => {
				if (this.mode == Mode.SIZING) {
					let x = e.clientX / Config.CELL_WIDTH,
						y = e.clientY / Config.CELL_WIDTH

					let size = Math.pow(this.sx - x, 2) + Math.pow(this.sy - y, 2)
					size = Math.round(Math.sqrt(size))

					this.emit('size-changed', size)

				} else {
					this.updateCoord(e.clientX, e.clientY)
				}
			},

			'mouseup mouseleave': (e) => {
				this.mode = Mode.NONE
			},

			// mobile
			'touchstart': (e) => {
				e.preventDefault()
				let oe = e.originalEvent

				if (oe.touches.length == 1) {
					this.mode = Mode.DRAW
					this.updateCoord(
						e.originalEvent.touches[0].pageX,
						e.originalEvent.touches[0].pageY,
						true)
				} else if (oe.touches.length == 2) {
					this.mode = Mode.SIZING
				}
			},

			'touchmove': (e) => {
				e.preventDefault()
				if (this.mode == Mode.SIZING) {
					let t = e.originalEvent.touches
					let size = Math.sqrt(
						Math.pow(t[0].pageX - t[1].pageX, 2) +
						Math.pow(t[0].pageY - t[1].pageY, 2))

					size /= Config.CELL_WIDTH * 16

					this.emit('size-changed', size)

					this.updateCoord(
						(t[0].pageX + t[1].pageX) / 2,
						(t[0].pageY + t[1].pageY) / 2)


				} else {
					this.updateCoord(
						e.originalEvent.touches[0].pageX,
						e.originalEvent.touches[0].pageY)
				}
			},

			'touchend': (e) => {
				e.preventDefault()
				this.mode = Mode.NONE
			}
		})

	}

	updateCoord(x, y, reset) {
		if (this.isPortrait) {
			this.coord.set(y / Config.CELL_WIDTH, (window.innerWidth - x) / Config.CELL_WIDTH)
		} else {
			this.coord.set(x / Config.CELL_WIDTH, y / Config.CELL_WIDTH)
		}

		if (reset !== undefined)
			this.curtPos.copy(this.coord)
	}

	update() {
		// console.log(this.curtPos.x, this.curtPos.y)
		this.prevPos.copy(this.curtPos)
		this.curtPos.copy(this.coord)
	}
}