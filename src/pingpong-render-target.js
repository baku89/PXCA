export default class PingpongRenderTarget {

	constructor(w, h) {
		if (w && h) {
			this.setSize(w, h)
		}
		
	}

	setSize(w, h) {

		console.log('pingpno')

		if (this.src) this.src.dispose()
		if (this.dst) this.dst.dispose()

		let params = {
			minFilter: THREE.NearestFilter,
			magFilter: THREE.NearestFilter,
			format: THREE.RGBAFormat
		}

		this.src = new THREE.WebGLRenderTarget(w, h, params)
		this.dst = new THREE.WebGLRenderTarget(w, h, params) 
	}

	swap() {
		[this.src, this.dst] = [this.dst, this.src]
	}
}