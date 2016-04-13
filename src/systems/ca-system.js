
export default class CASystem {

	constructor() {

		this.type = null
		this.brushes = {
			list: [],
			active: null,
			order: []
		}
		this.caShader = ''
		this.filterShader = ''

		this.baseColor = null

		this.help = ''

		this.filterUniforms = {}
	}
}