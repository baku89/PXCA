import Config from './config.js'


export default class Brush {

	constructor() {

		this.type = 'fuse'

		this.data = {
			fuse: {name: 'Fuse',   color: '#d5d7bf', index: 2 * 0xff, size: Config.PC ? 3.0 : 1.5},
			bomb: {name: 'Bomb',   color: '#dad95c', index: 3 * 0xff, size: Config.PC ? 3.0 : 1.5},
			fire: {name: 'Fire',   color: '#f52661', index: 4 * 0xff, size: Config.PC ? 2.0 : 1.5},
			wall: {name: 'Wall',   color: '#272e38', index: 1 * 0xff, size: Config.PC ? 3.0 : 3.0},
			ersr: {name: 'Eraser', color: '#61686E', index: 0 * 0xff, size: Config.PC ? 5.0 : 5.0}
		}

		this.$palette = $('.palette')

		this.initPalette()

	}

	initPalette() {

		Object.keys(this.data).forEach((key) => {
			let brush = this.data[key]
			let $brush = $('<button></button>')

			$brush
				.addClass('brush')
				.css('background-color', brush.color)
				.attr('data-type', key)
				.on('click', () => this.changeBrush(key))

			if (this.type == key) {
				$brush.addClass('is-active')
			}

			this.$palette.append($brush)
		})

		this.$brushes = $('.brush')

	}

	changeBrush(type) {
		this.type = type
		this.$brushes.removeClass('is-active')
		this.$brushes.filter(`[data-type=${this.type}]`).addClass('is-active')
	}

	get size() {
		return this.data[this.type].size
	}

	get index() {
		return this.data[this.type].index
	}


}