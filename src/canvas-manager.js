import 'jquery.throttledresize.js'

import './global-renderer.js'

import Config from './config.js'
import BasePass from './base-pass.js'
import PingpongRenderTarget from './pingpong-render-target.js'
import CARenderTarget from './ca-render-target.js'
import Brush from './brush.js'
import Cursor from './cursor.js'
import Share from './share.js'
import Base64Util from './base64-util.js'

const renderer = window.renderer
const state = window.state


export default class CanvasManager {
	
	constructor() {

		this.$canvas = $('#canvas')

		this.cursor = new Cursor(this.$canvas)
		this.brush = new Brush()
		this.pingpong = new PingpongRenderTarget()
		
		this.share = new Share()

		this.renderPass = new BasePass({
			fragmentShader: require('./shaders/passthru.frag'),
			uniforms: {
				buffer: {type: 't', value: null}
			}
		})

		// event
		$(window).on('throttledresize', this.onResize.bind(this))
		$(window).on('keyup', this.onKeyup.bind(this))

		this.clear = this.clear.bind(this)

		state.onentershare = this.postMap.bind()
	}

	onKeyup(e) {

		switch (e.keyCode) {
			case 32: // Space
				if (state.current == 'draw')
					state.pause()
				else if (state.current == 'paused')
					state.resume()
				break	
		}
	}

	postMap() {


		let rect = this.share.rect

		let x = rect.x
		let y = rect.y
		let w = Config.SHARE_WIDTH
		let h = Config.SHARE_HEIGHT

		let pixels = new Uint8Array(w * h * 4)
		this.pingping.readPixels(x, y, w, h, pixels)

		// check
		{
			let filled = false

			for (let i = 0, len = w * h; i < len; i++) {
				if (pixels[i*4] || pixels[i*4+1] || pixels[i*4+2]) {
					filled = true
					break
				}
			}

			if (!filled) {
				this.share.failed('Please draw something.')
				return
			}
		}

		// encode canvas to base64
		{
			let map64 = Base64Util.convertArray(pixels, w, h)

			// re-draw without cursor highlight
			this.filterPass.uniforms.

		}


	}


	clear() {
		this.pingpong.clear()
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

				brushType: 		{ type: 'i', value: null},
				brushSize2: 	{ type: 'f', value: null}
			}
		})
		this.uniforms = this.caPass.uniforms

		this.filterPass = new BasePass({
			fragmentShader: system.filterShader,
			uniforms: {
				buffer: 		{type: 't',		value: null},
				curtPos: 		{type: 'v2',	value: this.cursor.curtPos},
				brushSize2:	{ type: 'f',	value: null},

				shareRect:	{type: 'v4',	value: new THREE.Vector4()},
				outerOpacity:	{ type: 'f',	value: null}
			}
		})
		this.share.updateUniforms(this.filterPass.uniforms)

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

		if (this.filteredTex) this.filteredTex.dispose()
		this.filteredTex = new CARenderTarget(w, h)
		this.renderPass.uniforms.buffer.value = this.filteredTex

		this.share.updateResolution(w, h)
	}

	loadMap(url) {

		let d = $.Deferred()
		let map = new Image()

		map.onload = () => {

			let $canvas = document.createElement('canvas')
			let ctx = $canvas.getContext('2d')
			let shareRect = this.filterPass.uniforms.shareRect.value

			$canvas.width = this.width
			$canvas.height = this.height
			ctx.drawImage(map, shareRect.x, shareRect.y, Config.SHARE_WIDTH, Config.SHARE_HEIGHT)

			let texture = new THREE.Texture($canvas)
			texture.minFilter = THREE.NearestFilter
			texture.magFilter = THREE.NearestFilter
			this.pingpong.resetByTexture(texture)

			d.resolve()
		}

		map.onerror = () => {
			d.reject()
			console.error('CanvasManager: cannot load map')

		}

		map.src = url

		return d.promise()
	}

	render() {

		// 1. update CA
		this.uniforms.buffer.value = this.pingpong.src
		this.cursor.update()

		this.uniforms.brushType.value = this.brush.index
		this.uniforms.brushSize2.value = this.brush.size2
		this.caPass.render(this.pingpong.dst)

		/// 2. filter
		this.filterPass.uniforms.buffer.value = this.pingpong.dst
		this.filterPass.uniforms.brushSize2.value = this.brush.size2
		this.filterPass.render(this.filteredTex)

		// 3. render to main canvas
		this.renderPass.render()

		this.pingpong.swap()
	}


}