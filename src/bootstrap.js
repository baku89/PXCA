import './state.js'

let isSupported = true

// canvas
isSupported &= (function() {

	let canvas = document.createElement('canvas')
	let gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')

	return gl && gl instanceof WebGLRenderingContext

})()


// history
isSupported &= !!(window.history && window.history.pushState)


// webworkers
isSupported &= !!window.Worker




if (isSupported) {

	require(['./app.js'], function(App) {
		window.app = new App.default()
	})

} else {

	require('./jade/_unsupported.jade')()

}