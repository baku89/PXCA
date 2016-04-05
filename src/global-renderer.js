window.renderer = new THREE.WebGLRenderer({
	canvas: document.getElementById('canvas'),
	antialias: false,
	alpha: false,
	precision: 'mediump',
	stencil: false,
	depth: false,
	premultipledAlpha: false,
	softObject: false
})