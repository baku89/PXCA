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
import Mobile from './mobile.js'

const renderer = window.renderer
const state = window.state
const router = window.router

const reKeyNumerical = /[1-9]/
const isKeyNumerical = function(key) {
	return reKeyNumerical.exec(key) != null
}

export default class CanvasManager {
	
	constructor() {

		this.$canvas = $('#canvas')

		this.clock = new THREE.Clock(true)

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

		state.onleaveloading = () => {this.$canvas.removeClass('is-hidden')}
		state.onloadMap = (event, from, to, map) => {
			console.log(map)
			this.loadMap(map)
		}
		state.onpostMap = this.postMap.bind(this)

		this.cursor.on('size-changed', (size) => {
			this.brush.changeSize(size)
		})
	}

	initSystem(system) {

		this.system = system

		this.brush.init(system)

		this.caPass = new BasePass({
			fragmentShader: system.caShader,
			uniforms: {
				resolution: {type: 'v2', value: new THREE.Vector2()},
				time: 			{type: 'f',	 value: this.clock.getElapsedTime()},
				dx: 				{type: 'f',	 value: null},
				dy: 				{type: 'f',	 value: null},

				buffer: 		{type: 't',  value: null},
				prevPos:  	{type: 'v2', value: this.cursor.prevPos},
				curtPos: 		{type: 'v2', value: this.cursor.curtPos},
				cursorMode:		{ type: 'i',	value: 0},

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

	onKeyup(e) {

		const key = String.fromCharCode(e.keyCode) 

		switch (key) {
			case ' ': // Space
				if (state.current == 'draw')
					state.pause()
				else
					state.resume()
				
				break	
			case 'S':
				state.postMap()
				break
			case 'G':
				state.showGallery()
				break
			case 'C':
				this.clear()
				break
			default:
				if (e.keyCode == 38) {
					this.brush.changeSize(this.brush.size + 1)
				} else if (e.keyCode == 40) {
					this.brush.changeSize(this.brush.size - 1)
				} else if (isKeyNumerical(key)) {
					this.brush.changeIndex(parseInt(key)-1)
				}
		}
	}


	clear() {
		router.clear()
		this.pingpong.clear()
	}

	

	onResize() {
		let ww = window.innerWidth
		let wh = window.innerHeight
		let DPR = (window.devicePixelRatio) ? window.devicePixelRatio : 1

		
		if (Mobile.getOrientation() == 'portrait') {
			[ww, wh] = [wh, ww]
		}

		renderer.setSize(ww, wh)
		renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1)

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

		this.render(false)
	}

	loadMap(url) {

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

			this.render(false)

			state.previewMap()
		}

		map.onerror = () => {
			router.clear()
			state.resume()
			console.error('CanvasManager: cannot load map')
		}

		map.src = url
	}

	render(isUpdateCA) {

		// 1. update CA
		if (isUpdateCA) {
			this.uniforms.buffer.value = this.pingpong.src
			this.cursor.update()

			this.uniforms.time.value = this.clock.getElapsedTime()
			this.uniforms.cursorMode.value = this.cursor.mode
			this.uniforms.brushType.value = this.brush.index
			this.uniforms.brushSize2.value = this.brush.size2
			this.caPass.render(this.pingpong.dst)

			this.pingpong.swap()
		}

		/// 2. filter
		this.filterPass.uniforms.buffer.value = this.pingpong.dst
		this.filterPass.uniforms.brushSize2.value = this.brush.size2
		this.filterPass.render(this.filteredTex)

		// 3. render to main canvas
		this.renderPass.render()
	}

	postMap() {

		let rect = this.share.rect

		let x = rect.x
		let y = rect.y
		let w = Config.SHARE_WIDTH
		let h = Config.SHARE_HEIGHT

		let pixels = new Uint8Array(w * h * 4)
		this.pingpong.readPixels(x, y, w, h, pixels)

		// 1. check
		let filled = false

		for (let i = 0, len = w * h; i < len; i++) {
			if (pixels[i*4] || pixels[i*4+1] || pixels[i*4+2]) {
				filled = true
				break
			}
		}

		if (!filled) {
			state.showShare('failed', {message: 'Please draw something.'})
			return
		}

		// 2. encode canvas to base64
		let map64 = Base64Util.convertArray(pixels, w, h)

		// re-draw without cursor highlight
		this.filterPass.uniforms.brushSize2.value = -1
		this.filterPass.render(this.filteredTex)
		this.filteredTex.readPixels(x, y, w, h, pixels)

		let thumb64 = Base64Util.convertArray(pixels, w, h)

		// 3. create data
		$.ajax({
			type: 'POST',
			url: '/api/post.php',
			data: {
				type: this.system.type,
				map: map64,
				thumb: thumb64,
				parent_id: router.id,
				base_color: this.system.baseColor
			},

			success: (data) => {
				console.log(data)
				let json = null
				try {
					json = JSON.parse(data)
				} catch(e) {
					console.error('CanvasManager: JSON parse error')
				}

				if (!json || json.status == 'failed') {
					this.share.showAlertFailed('Sorry')
					return
				}

				router.id = json.id

				state.showShare('succeed', {
					url: json.url,
					id: json.id
				})

			}

		})

	}


}