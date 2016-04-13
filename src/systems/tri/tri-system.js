import Config from '../../config.js'
import CASystem from '../ca-system.js'

class PfwSystem extends CASystem {

	constructor() {
		super()

		this.title = '🔥 vs 🌳 vs 💧'
		this.name = '🔥 vs 🌳 vs 💧'
		this.type = 'tri'
		
		this.brushes = {
			list: {
				blnk: {name: 'Eraser',	color: '#69799A', index:   0,	size: Config.PC ? 5.0 : 5.0},
				soil: {name: 'Soil',		color: '#E7DAA2', index:  32,	size: Config.PC ? 10.0 : 10.0},
				plnt: {name: 'Plant',		color: '#71E37A', index:  64,	size: Config.PC ? 3.0 : 3.0},
				fire: {name: 'Fire',		color: '#EC2D4D', index:  96,	size: Config.PC ? 3.0 : 3.0},
				watr: {name: 'Water',		color: '#164DE0', index: 128,	size: Config.PC ? 3.0 : 3.0}
			},
			active: 'plnt',
			order: ['soil', 'fire', 'plnt', 'watr', 'blnk']
		}

		this.caShader = require('./tri-ca.frag')
		this.filterShader = require('./tri-filter.frag')

		this.baseColor = 0x323845

		this.help = 'It is a three-cornered battle. Fire burns Plant, Plant invades Water, and then Water puts out Fire. Soil is not affected by any objects. Eraser can erase.'

	}
}

export default new PfwSystem()