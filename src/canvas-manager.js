
import './global-renderer.js'
import Config from './config.js'
import BasePass from './base-pass.js'
import PingpongRenderTarget from './pingpong-render-target.js'
import Brush from './brush.js'

const renderer = window.renderer

const DEFOCUS_POS = -100

export default class CanvasManager {
	
	constructor() {


		this.$canvas = $('#canvas')

		this.coord = new THREE.Vector2(DEFOCUS_POS, DEFOCUS_POS)
		this.isDraw = false

		this.brush = new Brush()

		this.caPass = new BasePass({
			fragmentShader: require('./shaders/fuse-ca.frag'),
			uniforms: {
				buffer: 		{type: 't',  value: null},
				resolution: {type: 'v2', value: new THREE.Vector2()},
				prevPos:  	{type: 'v2', value: new THREE.Vector2(DEFOCUS_POS, DEFOCUS_POS)},
				curtPos: 		{type: 'v2', value: new THREE.Vector2(DEFOCUS_POS, DEFOCUS_POS)},
				shareRect: 	{type: 'v4', value: new THREE.Vector4()},

				brushType: 		{ type: 'i', value: this.brush.index},
				brushSize: 		{ type: 'f', value: this.brush.size}
			}
		})
		this.uniforms = this.caPass.uniforms
		this.pingpong = new PingpongRenderTarget()

		this.filterPass = new BasePass({
			fragmentShader: require('./shaders/passthru.frag'),
			uniforms: {
				buffer: 		{type: 't',  value: null}
			}

		})

		this.initEvent()
	}

	initEvent() {

		$(window).on('resize', () => {

			let ww = window.innerWidth
			let wh = window.innerHeight

			renderer.setSize(ww, wh)
			this.updateResolution(
				Math.ceil(ww / Config.CELL_WIDTH),
				Math.ceil(wh / Config.CELL_WIDTH))
		}).trigger('resize')

		this.$canvas.on({

			'mousedown': (e) => {
				this.isDraw = true
				this.updateCoord(e.clientX, e.clientY, true)
			},

			'mousemove': (e) => {
				if (this.isDraw) {
					this.updateCoord(e.clientX, e.clientY)
				}
			},

			'mouseup mouseleave': (e) => {
				this.isDraw = false
				this.updateCoord(DEFOCUS_POS, DEFOCUS_POS, true)
			},


			// mobile
			'touchstart': (e) => {
				e.preventDefault()
				this.updateCoord(
					e.changedTouches[0].pageX,
					e.changedTouches[0].pageY,
					true)
			},

			'touchmove': (e) => {
				e.preventDefault()
				this.updateCoord(
					e.changedTouches[0].pageX,
					e.changedTouches[0].pageY)
			},

			'touchend': (e) => {
				e.preventDefault()
				this.updateCoord(DEFOCUS_POS, DEFOCUS_POS, true)
			}
		})
	}

	updateCoord(x, y, reset) {
		this.coord.set(x, y)
		if (reset !== undefined) {
			this.uniforms.curtPos.value.set(x / Config.CELL_WIDTH, y / Config.CELL_WIDTH)
		}
	}

	updateResolution(w, h) {

		this.uniforms.resolution.value.set(w, h)
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
		this.uniforms.prevPos.value.copy(this.uniforms.curtPos.value)
		this.uniforms.curtPos.value.set(
			Math.round(this.coord.x / Config.CELL_WIDTH),
			Math.round(this.coord.y / Config.CELL_WIDTH))

		this.caPass.render(this.pingpong.dst)

		// alert(this.uniforms.brushType.value)
		// alert(this.uniforms.brushSize.value)

		/// 2. render to main canvas
		this.filterPass.uniforms.buffer.value = this.pingpong.dst
		this.filterPass.render()


		this.pingpong.swap()

	}


}