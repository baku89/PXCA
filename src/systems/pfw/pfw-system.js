import Config from '../../config.js'
import CASystem from '../ca-system.js'

class PfwSystem extends CASystem {

	constructor() {
		super()

		this.type = 1
		
		this.brushData = {
			blnk: {name: 'Eraser',	color: '#61686E', index: 	0,	size: Config.PC ? 5.0 : 5.0},
			plnt: {name: 'Plant',		color: '#272e38', index:  32,	size: Config.PC ? 3.0 : 3.0},
			fire: {name: 'fire',		color: '#d5d7bf', index:  64,	size: Config.PC ? 1.5 : 3.0},
			watr: {name: 'Water',		color: '#dad95c', index:  96,	size: Config.PC ? 1.5 : 3.0},
			soil: {name: 'Soil',		color: '#f52661', index: 128,	size: Config.PC ? 1.5 : 2.0}
		}

		this.initialBrush = 'fire'

		this.paletteOrder = ['soil', 'fire', 'plnt', 'watr', 'blnk']

		this.caShader = require('./pfw-ca.frag')
		this.filterShader = require('./pfw-filter.frag')

		this.baseColor = 0x000000//474d52

	}
}

export default new PfwSystem()