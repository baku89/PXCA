
let state = window.state

export default class MobileManager {

	constructor() {

		this.mq = require('media-query-listener')
		this.mq.on('change', (breakpoint) => {

			if (breakpoint == 'pc' && state.is('menu')) {
				state.foldMenu()
			}
		})

		$('.menu__btn').on('click', () => {
			if (state.is('drawing')) {
				state.expandMenu()
			} else if (state.is('menu')) {
				state.foldMenu()
			}
		})

	}
}