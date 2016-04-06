import BasePass from './base-pass.js'

let resetPass = new BasePass({
	fragmentShader: require('./shaders/passthru.frag'),
	uniforms: {
		buffer: {type: 't', value: null}
	}
})

let renderer = window.renderer

export default class CARenderTarget extends THREE.WebGLRenderTarget {

	constructor(w, h) {
		super(w, h, {
			minFilter: THREE.NearestFilter,
			magFilter: THREE.NearestFilter,
			format: THREE.RGBAFormat
		})
	}

	resetByTexture(texture) {
		texture.needsUpdate = true
		resetPass.uniforms.buffer.value = texture
		resetPass.render(this)
	}

}