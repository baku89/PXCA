import Config from './config.js'

Vue.config.debug = true

export default class Brush extends Vue {

	constructor() {

		super({
			el: '.palette',
			data: {
				brushes: {
					list: {},
					active: null,
					order: []
				}
			},

			ready() {
				console.log(this)
			},

			computed: {
				index: function() {
					return this.brushes.list[this.brushes.active].index
				},
				size: function() {
					return this.brushes.list[this.brushes.active].size
				},
				size2: function() {
					return Math.pow(this.brushes.list[this.brushes.active].size , 2)
				},
				brushList: function() {
					let list = []
					this.system.brush
				}
			},

			methods: {
				changeType(type) {
					this.brushes.active = type
				}
			}
		})
	}

	changeSize(size) {
		this.brushes.list[this.brushes.active].size = Math.max(0.5, size)
	}		

	changePaletteIndex(index) {
		this.brushes.active = this.brushes.order[index]
	}
	
}
