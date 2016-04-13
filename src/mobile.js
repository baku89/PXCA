import Config from './config.js'
import EventEmitter from 'eventemitter3'

let state = window.state

class Mobile extends EventEmitter {

	constructor() {
		super()


		if (!Config.PC) {

			$(window).on('orientationchange', () => {
				
				let orientation = this.getOrientation()
				$('body').attr('data-orientation', orientation)

				this.emit('orientationchange', orientation)
					
			}).trigger('orientationchange')

		}

		this.mq = require('media-query-listener')
		this.mq.on('change', (breakpoint) => {

			if (breakpoint == 'pc' && state.is('menu')) {
				state.resume()
			}

		})

		$('.menu__btn').on('click', () => {
			if (state.current == 'draw') {
				state.expandMenu()
			} else if (state.current == 'menu') {
				state.resume()
			}
		})

	}

	getOrientation() {
		if (Config.PC) {
			return null
		} else {
			if ((typeof window.orientation !== 'undefined') && Math.abs(window.orientation) != 90) {
				return 'portrait'
			} else {
				return 'landscape'
			}
		}
	}

}

export default new Mobile()