import Config from './config.js'


export default class Brush {

	init(system) {
		
		this.data = system.brushData
		this.paletteOrder = system.paletteOrder

		this.initPalette()
		this.changeType('fuse')
	}

	initPalette() {

		let $palette = $('.palette')

		this.paletteOrder.forEach((key) => {
			let brush = this.data[key]
			let $brush = $('<button></button>')

			$brush
				.addClass('brush')
				.css('background-color', brush.color)
				.attr('data-type', key)
				.on('click', () => this.changeType(key))

			$palette.append($brush)
		})

		this.$brushes = $('.brush')
		
	}

	changeType(type) {
		this.type = type
		this.size = this.data[this.type].size
		this.index = this.data[this.type].index
		this.size2 = this.size * this.size

		this.$brushes.removeClass('is-active')
		this.$brushes.filter(`[data-type=${this.type}]`).addClass('is-active')
	}


}