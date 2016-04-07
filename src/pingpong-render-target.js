import CARenderTarget from './ca-render-target.js'

let renderer = window.renderer

export default class PingpongRenderTarget {

	constructor(w, h) {
		if (w && h) {
			this.setSize(w, h)
		}
		
	}

	setSize(w, h) {

		if (this.width == w && this.height == h) return

		let croppedTex = null

		if (this.src) {
			let ox = Math.floor( (this.width - w) / 2 )
			let oy = Math.floor( (this.height - h) / 2 )
			let pixels = new Uint8Array(w * h * 4)
			renderer.readRenderTargetPixels(this.src, ox, oy, w, h, pixels)
			croppedTex = new THREE.DataTexture(pixels, w, h)
		}


		if (!this.src) this.src = new CARenderTarget(w, h)
		if (!this.dst) this.dst = new CARenderTarget(w, h)

		this.src.setSize(w, h)
		this.dst.setSize(w, h)
		this.width = w
		this.height = h

		if (croppedTex) this.src.resetByTexture(croppedTex)
	}

	readPixels(x, y, w, h, pixels) {
		renderer.readRenderTargetPixels(this.dst, x, y, w, h, pixels)
	}

	resetByTexture(texture) {
		this.src.resetByTexture(texture)
		this.dst.resetByTexture(texture)
	}

	swap() {
		[this.src, this.dst] = [this.dst, this.src]
	}

	clear() {
		this.src.dispose()
		this.dst.dispose()
		this.src = new CARenderTarget(this.width, this.height)
		this.dst = new CARenderTarget(this.width, this.height)
	}


	// trim



}