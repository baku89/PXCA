import EventEmitter from 'eventemitter3'

let state = window.state

export default class Navigation extends EventEmitter {

	constructor() {
		super()

		$('.menu__clear').on('click', () => {
			if (state.current == 'menu')
				state.resume()
			this.emit('clear')
		})

		$('.menu__help').on('click', () => {
			state.showHelp()
		})

		$('.menu__share').on('click', () => {
			state.postMap()
		})

		$('.menu__gallery').on('click', () => {
			state.showGallery()
		})

		$('.layer').on('click', () => {
			state.resume()
		})

	}



}