/**
*
* build a scene simplified for generating 2D image by fragment shader
*
**/

export default class ShaderCanvas {

	constructor(shaderMaterial, flipV) {

		// init basic object
		this.scene = new THREE.Scene()
		this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10)

		this.shaderMaterial = shaderMaterial

		// setup scene object
		let plane

		if ( !flipV ){
			plane = new THREE.PlaneGeometry(2, 2)
		} else {

			plane = new THREE.Geometry()

			plane.vertices.push(
				new THREE.Vector3(-1, -1, 0),
				new THREE.Vector3(+1, -1, 0),
				new THREE.Vector3(-1, +1, 0),
				new THREE.Vector3(+1, +1, 0)
			)

			plane.faces.push(
				new THREE.Face3(0, 1, 2),
				new THREE.Face3(2, 1, 3)
			)

			plane.faceVertexUvs[0].push(
				[new THREE.Vector2(0, 1), new THREE.Vector2(1, 1), new THREE.Vector2(0, 0)],
				[new THREE.Vector2(0, 0), new THREE.Vector2(1, 1), new THREE.Vector2(1, 0)]
			)

			plane.verticesNeedUpdate = true
			plane.elementsNeedUpdate = true
			plane.uvsNeedUpdate = true
		}

		this.mesh = new THREE.Mesh( plane, this.shaderMaterial )
		this.scene.add( this.mesh )
	}

	render(renderTarget) {

		this.mesh.material = this.shaderMaterial
		window.renderer.render( this.scene, this.camera, renderTarget )
	}

	readPixels() {

		let renderTarget, x, y, width, height

		if ( arguments.length == 5 ) {

			renderTarget = arguments[0]
			x = arguments[1]
			y = arguments[2]
			width = arguments[3]
			height = arguments[4]

		} else if ( arguments.length == 6 ) {

			var params = {
				minFilter: THREE.NearestFilter,
				magFilter: THREE.NearestFilter,
				format: THREE.RGBAFormat
			}

			renderTarget = new THREE.WebGLRenderTarget(arguments[0], arguments[1], params)

			x = arguments[2]
			y = arguments[3]
			width = arguments[4]
			height = arguments[5]
		}

		this.render(renderTarget)

		var gl = window.renderer.getContext()

		var webglTexture = renderTarget.__webglTexture
		var fb = gl.createFramebuffer()

		gl.bindFramebuffer( gl.FRAMEBUFFER, fb )
		gl.framebufferTexture2D(
			gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
			gl.TEXTURE_2D, webglTexture, 0 )

		if (gl.checkFramebufferStatus( gl.FRAMEBUFFER ) != gl.FRAMEBUFFER_COMPLETE) {
			return null
		}

		let pixels = new Uint8Array(width * height * 4)

		gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
		gl.bindFramebuffer(gl.FRAMEBUFFER, null)

		return pixels

	}
}