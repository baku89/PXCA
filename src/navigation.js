import EventEmitter from 'eventemitter3'

let state = window.state

export default class Navigation extends EventEmitter {

	constructor() {
		super()

		$('.menu__clear').on('click', () => {
			this.emit('clear')
		})

		$('.menu__help').on('click', () => {
			state.showHelp()
		})

		$('.menu__share').on('click', () => {
			state.showShare()
		})

		$('.layer').on('click', () => {
			state.resume()
		})

	}



}