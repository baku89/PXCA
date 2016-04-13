export default class BasePass {

	constructor(option) {

		this.scene = new THREE.Scene()

		this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 10)
		this.camera.position.set(0, 0, 10)
		this.scene.add(this.camera)

		this.uniforms = option.uniforms || {}

		let mat = new THREE.RawShaderMaterial({
			uniforms: this.uniforms,
			vertexShader: option.vertexShader || require('./shaders/base-pass.vert'),
			fragmentShader: option.fragmentShader
		})

		let geom = new THREE.PlaneBufferGeometry(2, 2)

		// let geom = new THREE.BufferGeometry()

		//  y
		//  A
		//  |
		//
		// [0]---[1]
		//  |   / |
		//  |  /  |
		//  | /   |
		// [2]---[3]  --> x

		// let positions = new Float32Array([
		// 	-1, +1, 0,
		// 	+1, +1, 0,
		// 	-1, -1, 0,
		// 	+1, -1, 0
		// ])

		// let uvs = new Float32Array([
		// 	0, 1,
		// 	1, 1,
		// 	0, 0,
		// 	1, 0
		// ])

		// let aIndices = new Uint16Array([
		// 	0, 2, 1,
		// 	2, 3, 1
		// ])

		// geom.addAttribute('position', new THREE.BufferAttribute(positions, 3))
		// geom.addAttribute('uv', new THREE.BufferAttribute(uvs, 2))
		// geom.setIndex(new THREE.BufferAttribute(aIndices))

		let plane = new THREE.Mesh(geom, mat)
		this.scene.add(plane)
	}

	render(targetRenderer) {
		window.renderer.render(this.scene, this.camera, targetRenderer)
	}
}