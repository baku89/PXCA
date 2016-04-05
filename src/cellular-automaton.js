/* global _ */

/**
*
* automation.js
*
**/

import ShaderCanvas from './shader-canvas.js'
import PingpongRenderTarget from './pingpong-render-target.js'

export default class CellularAutomaton {

	constructor(parameters) {

		let builtinUniforms = {
			buffer:     {type:  't', value: null},
			resolution: {type: 'v2', value: null},
			dx:         {type:  'f', value: null},
			dy:         {type:  'f', value: null}
		}


		// properties 
		this.texture = null

		this.clearColor = (parameters.clearColor instanceof THREE.Color) ?
      new THREE.Color( 0x000000 ) :
      parameters.clearColor

		this.fragmentShader = parameters.fragmentShader

		this.uniforms = _.assign( builtinUniforms, parameters.uniforms )
		this.uniforms.dx.value = 1 / parameters.resolution.x
		this.uniforms.dy.value = 1 / parameters.resolution.y

		// private variables
		this.__canvas2d = document.createElement('canvas')

		this.__resolution = parameters.resolution.clone()

		this.pingpong = new PingpongRenderTarget(this.__resolution.x, this.__resolution.y)

		// init shaderCanvas
		this.__shaderMaterial = new THREE.RawShaderMaterial({
			uniforms: this.uniforms,
			vertexShader: require('./shaders/passthru.vert'),
			fragmentShader: this.fragmentShader,
			transparent: true
		})

		this.__passthruMaterial = new THREE.RawShaderMaterial({
			uniforms: this.uniforms,
			vertexShader: require('./shaders/passthru.vert'),
			fragmentShader: require('./shaders/passthru.frag'),
			transparent: true
		})

		this.__shaderCanvas = new ShaderCanvas(window.renderer, this.__shaderMaterial)
	}

	// update frame
	update() {

		this.uniforms.buffer.value = this.pingpong.src
		this.__shaderCanvas.render(this.pingpong.dst)

		this.texture = this.pingpong.dst

		this.pingpong.swap()
	}

	// read pixels
	readPixels(x, y, width, height) {

		let gl = window.renderer.getContext()

		let texture = this.texture.__webglTexture
		let fb = gl.createFramebuffer()

		gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
		gl.framebufferTexture2D(
			gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
			gl.TEXTURE_2D, texture, 0)

		if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
			console.log('CellularAutomaton.readPixels ERROR')
			return null
		}

		let pixels = new Uint8Array(width * height * 4)

		gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
		gl.bindFramebuffer(gl.FRAMEBUFFER, null)

		return pixels
	}

	// reset by filling 'clearColor'
	clear() {
		let texture = THREE.ImageUtils.generateDataTexture(
			this.__resolution.x,
			this.__resolution.y,
			new THREE.Color(this.clearColor))
		
		this.resetByTexture(texture)
	}

	// reset by texture
	resetByTexture(texture) {
		this.uniforms.buffer.value = texture

		this.__shaderCanvas.shaderMaterial = this.__passthruMaterial
		this.__shaderCanvas.render(this.pingpong.src)
		this.__shaderCanvas.shaderMaterial = this.__shaderMaterial
	}

	// change size
	setResolution(resolution) {

		let offset = this.__resolution.clone()

		this.__resolution = resolution.clone()

		offset.sub(this.__resolution)
		offset.divideScalar(2)

		// get cropped pixels byte arrays
		let pixels = this.readPixels(
			parseInt(offset.x), parseInt(offset.y),
			this.__resolution.x, this.__resolution.y)

		// flip verticaly
		let x, y, swap, ia, ib

		for (y = 0; y < this.__resolution.y / 2; y++) {
			for (x = 0; x < this.__resolution.x; x++) {

				ia = ( y * this.__resolution.x + x ) * 4
				ib = ( ( this.__resolution.y - y - 1 ) * this.__resolution.x + x ) * 4

				swap = pixels[ ia   ]; pixels[ ia   ] = pixels[ ib   ]; pixels[ ib   ] = swap
				swap = pixels[ ia+1 ]; pixels[ ia+1 ] = pixels[ ib+1 ]; pixels[ ib+1 ] = swap
				swap = pixels[ ia+2 ]; pixels[ ia+2 ] = pixels[ ib+2 ]; pixels[ ib+2 ] = swap
				swap = pixels[ ia+3 ]; pixels[ ia+3 ] = pixels[ ib+3 ]; pixels[ ib+3 ] = swap
			}
		}

		// craete new texture
		let newTexture = new THREE.DataTexture(
			pixels, this.__resolution.x, this.__resolution.y, THREE.RGBAFormat)
		newTexture.needsUpdate = true

		// create new RenderTarget
		this.pingpong.setSize(this.__resolution.x, this.__resolution.h)

		// update uniform resolution info
		this.uniforms.resolution.value = this.__resolution
		this.uniforms.dx.value = 1.0 / this.__resolution.x
		this.uniforms.dy.value = 1.0 / this.__resolution.y

		this.resetByTexture(newTexture)
	}

}