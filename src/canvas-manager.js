
import './global-renderer.js'
import Config from './config.js'
import BasePass from './base-pass.js'
import PingpongRenderTarget from './pingpong-render-target.js'
import Brush from './brush.js'
import Cursor from './cursor.js'



const renderer = window.renderer

export default class CanvasManager {
	
	constructor() {

		this.$canvas = $('#canvas')

		this.cursor = new Cursor(this.$canvas)
		this.brush = new Brush()
		this.pingpong = new PingpongRenderTarget()

		$(window).on('resize', this.onResize.bind(this))
	}

	initSystem(system) {

		this.brush.init(system)

		this.caPass = new BasePass({
			fragmentShader: system.caShader,
			uniforms: {
				resolution: {type: 'v2', value: new THREE.Vector2()},
				dx: 				{type: 'f',	 value: null},
				dy: 				{type: 'f',	 value: null},

				buffer: 		{type: 't',  value: null},
				prevPos:  	{type: 'v2', value: this.cursor.prevPos},
				curtPos: 		{type: 'v2', value: this.cursor.curtPos},
				shareRect: 	{type: 'v4', value: new THREE.Vector4()},

				brushType: 		{ type: 'i', value: null},
				brushSize2: 	{ type: 'f', value: null}
			}
		})
		this.uniforms = this.caPass.uniforms

		this.filterPass = new BasePass({
			fragmentShader: system.filterShader,
			uniforms: {
				buffer: 		{type: 't',  value: null}
			}
		})

		this.onResize()
	}

	onResize() {
		let ww = window.innerWidth
		let wh = window.innerHeight

		renderer.setSize(ww, wh)
		this.updateResolution(
			Math.ceil(ww / Config.CELL_WIDTH),
			Math.ceil(wh / Config.CELL_WIDTH))
	}
	
	updateResolution(w, h) {

		this.width = w
		this.height = h

		this.uniforms.resolution.value.set(w, h)
		this.uniforms.dx.value = 1.0 / w
		this.uniforms.dy.value = 1.0 / h

		this.pingpong.setSize(w, h)

		{
			let x = Math.floor((w - Config.SHARE_WIDTH) / 2)
			let y = Math.floor((h - Config.SHARE_HEIGHT) / 2)
			this.uniforms.shareRect.value.set(x, y, x + w, y + h)
		}
	}

	render() {

		// 1. update CA
		this.uniforms.buffer.value = this.pingpong.src
		this.cursor.update()

		this.uniforms.brushType.value = this.brush.index
		this.uniforms.brushSize2.value = this.brush.size2

		this.caPass.render(this.pingpong.dst)

		/// 2. render to main canvas
		this.filterPass.uniforms.buffer.value = this.pingpong.dst
		this.filterPass.render()


		this.pingpong.swap()

	}


}