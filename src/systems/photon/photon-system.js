import Config from '../../config.js'
import CASystem from '../ca-system.js'

class PhotonSystem extends CASystem {

	constructor() {
		super()

		this.title = 'P h o t o n'
		this.name = 'Photon'
		this.type = 'photon'
		
		this.brushes = {
			list: {
				blnk: {name: 'Eraser',	color: '#BB4AA3', index:   0,	size: Config.PC ? 5.0 : 5.0},
				mirr: {name: 'Mirror',	color: '#C2E0EB', index:  32,	size: Config.PC ? 3.0 : 3.0},
				wall: {name: 'Wall',		color: '#3C34A7', index:  64,	size: Config.PC ? 3.0 : 3.0},
				lght: {name: 'Light',		color: '#ffffff', index:  96,	size: Config.PC ? 1 : 1}
			},
			active: 'lght',
			order: ['lght', 'mirr', 'wall', 'blnk']
		}

		this.caShader = require('./photon-ca.frag')
		this.filterShader = require('./photon-filter.frag')

		this.baseColor = 0x2F2736

		this.help = 'Light emits rainbow beam. Mirror reflects and Wall absorbs it. Eraser can erase.'


		let rainbowData = require('url-loader?mimetype=image/png!./rainbow.png')
		let rainbowTex = new THREE.TextureLoader().load(rainbowData)

		rainbowTex.minFilter = THREE.NearestFilter
		rainbowTex.magFilter = THREE.NearestFilter


		this.filterUniforms = {
			rainbow: {type: 't', value: rainbowTex}
		}

	}
}

export default new PhotonSystem()