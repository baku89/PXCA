
export default class Base64Util {

	constructor() {
		this.canvas = document.createElement('canvas')
		this.ctx = this.canvas.getContext('2d')
	}

	convertArray(pixels, w, h) {

		this.canvas.width = w
		this.canvas.height = h

		// Copy the pixels to a 2D canvas
		let imageData = this.ctx.createImageData(w, h)
		imageData.data.set(pixels)
		this.ctx.putImageData(imageData, 0, 0)

		return this.canvas.toDataURL()
	}

	// export convertImageToBase64(img) {
	convertImage(img) {

		this.canvas.width = img.width
		this.canvas.height = img.height

		this.ctx.drawImage(img, 0, 0)

		return this.canvas.toDataURL()
	}
}




