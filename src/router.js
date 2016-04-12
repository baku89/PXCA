import {createHistory} from 'history'
// import EventEmitter from 'eventemitter3'

const state = window.state
const initialState = window.initialState

class Router {

	constructor() {

		this.history = createHistory()
		this._id = null
	}

	init() {

		/*
		if (initialMap.type) {

		}

			this._id = window.initialMap.id

			let map = window.initialMap.map
			state.loadMap(map)

		} else {
			state.resume()
		}*/
	}

	clear() {
		console.log('clear')
		this._id = null
		this.history.replace('')
	}

	set id(id) {
		console.log(id)
		this._id = id
		this.history.replace(`?n=${id}`)
		// this.history.replace(`${id}`)
	}

	get id() {
		return this._id
	}

}


window.router = new Router()