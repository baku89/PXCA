import Config from '../../config.js'
import CASystem from '../ca-system.js'

class PfwSystem extends CASystem {

	constructor() {
		super()

		this.title = '🔥 vs 🌳 vs 💧'
		this.type = 'pfw'
		
		this.brushData = {
			blnk: {name: 'Eraser',	color: '#222222', index:   0,	size: Config.PC ? 5.0 : 5.0},
			soil: {name: 'Soil',		color: '#cccc66', index:  32,	size: Config.PC ? 1.5 : 2.0},
			plnt: {name: 'Plant',		color: '#22ff22', index:  64,	size: Config.PC ? 3.0 : 3.0},
			fire: {name: 'fire',		color: '#ff2222', index:  96,	size: Config.PC ? 1.5 : 3.0},
			watr: {name: 'Water',		color: '#2222ff', index: 128,	size: Config.PC ? 1.5 : 3.0}
		}

		this.initialBrush = 'plnt'

		this.paletteOrder = ['soil', 'plnt', 'fire', 'watr', 'blnk']

		this.caShader = require('./pfw-ca.frag')
		this.filterShader = require('./pfw-filter.frag')

		this.baseColor = 0x000000//474d52

	}
}

export default new PfwSystem()