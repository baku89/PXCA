import Config from './config.js'

const DEFOCUS_POS = -100

const BUTTON_RIGHT = 2

export default class Cursor {

	constructor($canvas) {

		// public
		this.curtPos = new THREE.Vector2(DEFOCUS_POS, DEFOCUS_POS)
		this.prevPos = new THREE.Vector2(DEFOCUS_POS, DEFOCUS_POS)  

		// private
		this.$canvas = $canvas
		this.coord = new THREE.Vector2(DEFOCUS_POS, DEFOCUS_POS)
		this.isDraw = false

		this.$canvas.on({

			'mousedown': (e) => {
				this.isDraw = true
				this.updateCoord(e.clientX, e.clientY, true)
				
			},

			'mousemove': (e) => {
				if (this.isDraw) {
					this.updateCoord(e.clientX, e.clientY)
				}
			},

			'mouseup mouseleave': (e) => {
				this.isDraw = false
				this.updateCoord(DEFOCUS_POS, DEFOCUS_POS, true)
			},

			// mobile
			'touchstart': (e) => {
				e.preventDefault()
				this.updateCoord(
					e.originalEvent.touches[0].pageX,
					e.originalEvent.touches[0].pageY,
					true)
			},

			'touchmove': (e) => {
				e.preventDefault()
				this.updateCoord(
					e.originalEvent.touches[0].pageX,
					e.originalEvent.touches[0].pageY)
			},

			'touchend': (e) => {
				e.preventDefault()
				console.log('touchend')
				this.updateCoord(DEFOCUS_POS, DEFOCUS_POS, true)
			}
		})

	}

	updateCoord(x, y, reset) {
		this.coord.set(x, y)
		if (reset !== undefined) {
			this.curtPos.set(x / Config.CELL_WIDTH, y / Config.CELL_WIDTH)
		}
	}

	update() {
		
		this.prevPos.copy(this.curtPos)
		this.curtPos.set(
			Math.round(this.coord.x / Config.CELL_WIDTH),
			Math.round(this.coord.y / Config.CELL_WIDTH))
	}
}