import {createHistory} from 'history'
// import EventEmitter from 'eventemitter3'

const state = window.state

class Router {

	constructor() {

		this.history = createHistory()
		this._id = null
	}

	init() {
		if (window.initialMap) {

			this._id = window.initialMap.id

			let map = window.initialMap.map
			state.loadMap(map)

		} else {
			state.resume()
		}
	}

	clear() {
		this.id = null
		this.history.replace('')
	}

	set id(id) {
		this._id = id
		this.history.replace(`?n=${id}`)
		// this.history.replace(`${id}`)
	}

	get id() {
		return this._id
	}

}


window.router = new Router()