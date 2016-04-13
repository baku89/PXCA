import hexRgb from 'hex-rgb'

export default class Help extends Vue {

	constructor() {
		super({
			el: '.help',
			data: {
				system: {
					brushes: {
						list: {},
						order: []
					},
					name: '',
					help: ''
				}
			},
			computed: {
				htmlHelp: function() {
					let help = this.system.help

					this.system.brushes.order.forEach((type) => {
						let brush = this.system.brushes.list[type]
						let color = brush.color
						let rgb = hexRgb(color)
						let brightness = (rgb[0] + rgb[1] + rgb[2]) / 3.0
						if (brightness < 64) {
							color = `rgb(${rgb[0] + 32}, ${rgb[1] + 32}, ${rgb[2] + 32})`
						}
						help = help.split(brush.name).join(`<span style='color: ${color};border-color:${color};'>${brush.name}</span>`)
					})

					return help
				}
			}
		})
	}
}