import Systems from './systems.js'

const state = window.state


export default class Home {

	constructor() {

		new Vue({
			el: '.home',
			data: {
				systems: Systems,
				type: null
			},
			methods: {
				changeType(e, type) {
					state.changeType(type)
				}
			}
		})
	}
}