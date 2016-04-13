import Systems from './systems.js'
import StateMachine from 'javascript-state-machine'
import {createHistory} from 'history'

let $body = $('body')

let history  = createHistory()

class CustomFSM {

	constructor() {
		this.onenterstate = this.onenterstate.bind(this)

		this.startup()

		this.ASYNC = StateMachine.ASYNC
	}

	init() {
		let initialState = window.initialState
		
		if (initialState.type && initialState.id) {
			this.type = initialState.type
			this.id = initialState.id
			this.loadMap(initialState)
		} else if (initialState.type) {
			this.type = initialState.type
			this.changeType(initialState.type)
		} else {
			this.showHome()
		}
	}

	onenterstate(event, from, to, param) {
		$body.attr('data-status', to)

		if (event == 'changeType') {
			this.type = param
			this.pushHistory()
		
		} else if (event == 'showHome') {
			this.type = null
			this.id = null
			this.pushHistory()

		} else if (event == 'loadMap') {
			this.type = param.type
			this.id = param.id
			this.pushHistory()

		} else if (event == 'clear') {
			this.id = null
			this.pushHistory()
		
		} else if (event == 'showShare') {
			if (param.status == 'succeed') {
				this.id = param.content.id
				this.pushHistory()
			}
		}


	}

	pushHistory() {

		let uri = ''

		if (this.type) {
			uri += this.type
			document.title = Systems[this.type].title

			if (this.id != null)  {
				uri += `/${this.id}`
			}

		} else {
			document.title = '::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
		}

		history.replace(uri)
	}

}


let state = StateMachine.create({
	initial: 'loading',
	target: CustomFSM.prototype,
	events: [
		{name: 'changeType', 	from: ['home', 'loading'], to: 'draw'},
		{name: 'showHome',		from: ['draw', 'loading', 'menu'], to: 'home'},
		{name: 'pause',				from: 'draw',	to: 'paused'},
		{name: 'clear',				from: ['menu', 'draw'], to: 'draw'},
		{name: 'resume',			from: ['loading', 'posting', 'paused', 'gallery', 'share', 'help', 'menu'], to: 'draw'},
		{name: 'expandMenu', 	from: 'draw', to: 'menu'},
		{name: 'showGallery', from: ['draw', 'menu', 'share'], to: 'gallery'},
		{name: 'showHelp',		from: ['draw', 'menu'], to: 'help'},
		{name: 'postMap',			from: ['draw', 'menu'], to: 'posting'},
		{name: 'showShare',		from: 'posting', to: 'share'},
		{name: 'loadMap',			from: ['loading', 'gallery'], to: 'loading'},
		{name: 'previewMap',	from: 'loading', to: 'paused'}
	]
})


window.state = state