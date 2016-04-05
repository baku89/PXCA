/* global Stats, Detector */

import ticker from 'ticker'
import MobileDetect from 'mobile-detect'

import ShaderCanvas from './shader-canvas.js'
import CellularAutomaton from './cellular-automaton.js'
import Base64Util from './base64-util.js'

let md = new MobileDetect(window.navigator.userAgent)

//--------------------------------------------------
// utils

let scroll =
	window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	// IE Fallback, you can even fallback to onscroll
	function(callback){ window.setTimeout(callback, 1000/60) }

//--------------------------------------------------
// constants

const	CELL_WIDTH = md.mobile() ? 2 : 4

const BRUSH_DATA = {
	Ersr: {index: 0, size: md.mobile() ? 5.0 : 5.0},
	Wall: {index: 1, size: md.mobile() ? 3.0 : 3.0},
	Fuse: {index: 2, size: md.mobile() ? 3.0 : 1.5},
	Bomb: {index: 3, size: md.mobile() ? 3.0 : 1.5},
	Fire: {index: 4, size: md.mobile() ? 2.0 : 1.5}
}

const MOBILE_WIDTH = 960

const SHARE_SIZE_LONG = 240
const SHARE_SIZE_SHORT = 160


const OPACITY_SHARE = {
	on: 0.3,
	off: 0.96
}

const URL = 'http://s.baku89.com/fuse/'


//--------------------------------------------------
// variables

window.renderer = null

// jQuery

//--------------------------------------------------
// on ready

class App {

	constructor() {

		console.log('setup')

		this.lockLoadingGallery = false
		this.resolution = new THREE.Vector2()
		this.isMouseDown = false


		this.shareRect = new THREE.Vector4()
		this.shareSize = {}

		this.loadedPage = 0

		this.isPaused = false

		this.cntMouse = new THREE.Vector2()
		this.caPrevMouse = new THREE.Vector2()

		this.evaluteLoadingGallery = this.evaluteLoadingGallery.bind(this)

		this.base64Util = new Base64Util()


		/* ========== init jQ ========== */

		this.$body  		  = $('body')
		this.$canvas      = $('#canvas')
		this.$tools       = $('.tools__btn')
		this.$gallery 	  = $('.layer--gallery')
		this.$galleryList = $('.layer--gallery__list')


		// check support

		if ( !( Detector.canvas && Detector.webgl ) ) {

			this.$body.attr('data-status', 'unsupported')
			return
		}

		// event
		this.onResize = this.onResize.bind(this)
		this.onKeyUp = this.onKeyUp.bind(this)
		this.onPopState = this.onPopState.bind(this)
		this.onOrientationChange = this.onOrientationChange.bind(this)

		this.onMouseMove 	= this.onMouseMove.bind(this)
		this.onMouseDown 	= this.onMouseDown.bind(this)
		this.onMouseUp   	= this.onMouseUp.bind(this)
		this.onTouchMove 	= this.onTouchMove.bind(this)
		this.onTouchStart	= this.onTouchStart.bind(this)
		this.onTouchEnd  	= this.onTouchEnd.bind(this)
		
		this.updateResolution = this.updateResolution.bind(this)

		$(window).on({
			'resize': this.onResize,
			'keyup':  this.onKeyUp,
			'popstate': this.onPopState.bind,
			'orientationchange': this.onOrientationChange
		}).trigger('orientationchange')

		this.$canvas.on({
			'mousemove': this.onMouseMove,
			'mousedown': this.onMouseDown,
			'mouseup':  this.onMouseUp,
			'touchmove': this.onTouchMove,
			'touchstart': this.onTouchStart,
			'touchend': this.onTouchEnd
		})

		this.$tools.on('click', this.onClickTools.bind(this))

		$('.menu__btn').on('click', this.toggleMenu.bind(this))
		$('.menu__clear').on('click', this.clearCanvas.bind(this))
		$('.menu__share').on('click', this.showShare.bind(this))
		$('.menu__gallery').on('click', this.showGallery.bind(this))
		$('.menu__help').on('click', this.showHelp.bind(this))

		$('.layer:not(.layer--share)').on('click', this.closeLayer.bind(this))
		$('.layer--share').on('click', this.closeShare.bind(this))
		$('.layer--share *, .layer--help a').on('click', this.preventClosingLayer.bind(this))
		$('.alert--complete__tweet').on('click', this.tweet.bind(this))

		this.$gallery.on( 'scroll', this.onScrollGallery.bind(this))
		$(document).on('click', '.layer--gallery__list li', this.loadMap.bind(this))



		/* ========== init CA System ========== */

		this.currentBrush = 'Fuse'

		// get current parameters
		this.resolution.set(
			Math.ceil( this.$canvas.width() / CELL_WIDTH ),
			Math.ceil( this.$canvas.height() / CELL_WIDTH ))

		let x = Math.floor(( this.resolution.x - this.shareSize.width ) / 2)
		let y = Math.floor(( this.resolution.y - this.shareSize.height ) / 2)
		this.shareRect.set(x, y, x + this.shareSize.width, y + this.shareSize.height)

		// init scene, renderer, camera
		window.renderer = new THREE.WebGLRenderer({
			canvas: this.$canvas[0],
			antialias: false,
			alpha: true
		})
		window.renderer.setSize(this.$canvas.width(), this.$canvas.height())

		this.shader = new THREE.ShaderMaterial({
			vertexShader: require('./shaders/passthru.vert'),
			fragmentShader: require('./shaders/fuse-filter.frag'),
			uniforms: {
				buffer:         { type: 't', value: null },

				resolution: 	{ type:'v2', value: this.resolution },
				shareRect:   	{ type:'v4', value: this.shareRect },

				cntMouse: 		{ type:'v2', value: new THREE.Vector2() },
				brushType: 		{ type: 'i', value: BRUSH_DATA[this.currentBrush].index },
				brushSize: 		{ type: 'f', value: BRUSH_DATA[this.currentBrush].size },

				colorBlnk:      { type: 'c', value: new THREE.Color( 0x474d52 ) },
				colorWallBg:	{ type: 'c', value: new THREE.Color( 0x272e38 ) },
				colorWallLn:	{ type: 'c', value: new THREE.Color( 0x323942 ) },
				colorFuse:	    { type: 'c', value: new THREE.Color( 0xd5d7bf ) },
				colorBomb:	    { type: 'c', value: new THREE.Color( 0xdad95c ) },
				colorFireFr:	{ type: 'c', value: new THREE.Color( 0xee9121 ) },
				colorFireBk:	{ type: 'c', value: new THREE.Color( 0xf52661 ) },
				opacityShare:   { type: 'f', value: OPACITY_SHARE.off }
			}
		})
		this.mainCanvas = new ShaderCanvas(this.shader, true)

		// init ca
		this.ca = new CellularAutomaton({
			fragmentShader: require('./shaders/fuse-ca.frag'),
			resolution: this.resolution,
			uniforms: {
				resolution: {type: 'v2', value: this.resolution},
				prevMouse:  {type: 'v2', value: new THREE.Vector2()},
				cntMouse:   {type: 'v2', value: new THREE.Vector2()},
				isMouseDown:{type:  'i', value: 0},
				brushSize:  {type:  'f', value: BRUSH_DATA[this.currentBrush].size},
				brushType:  {type:  'i', value: BRUSH_DATA[this.currentBrush].index},
				isPause: 		{type:  'i', value: 0}
			}
		})


		/* ========== Setup InitMap ========== */
		let id = this.$body.data('id')
		let map = this.$body.data('map')

		if (id && map) {

			this.loadMap(id, map)
		
		}

		/* ========== Start ========== */

		ticker(window, 50).on('tick', this.draw.bind(this))
	}

	// --------------------------------------------------
	// ! window event

	initStats() {

		this.stats = new Stats()
		this.stats.domElement.style.position = 'absolute'
		this.stats.domElement.style.top = 0
		this.stats.domElement.style.left = 0
		document.body.appendChild(this.stats.domElement)
	}

	// --------------------------------------------------
	// ! window event

	isPortrait() {
		return (typeof window.orientation !== 'undefined') && Math.abs(window.orientation) != 90
	}

	onResize() {

		window.resizeEvent
		clearTimeout( window.resizeEvent )

		window.resizeEvent = setTimeout(this.updateResolution, 250)
	}

	onOrientationChange() {

		if ( this.isPortrait() ) {

			// portrait
			this.shareSize.width = SHARE_SIZE_SHORT
			this.shareSize.height = SHARE_SIZE_LONG

		} else {

			// landscape
			this.shareSize.width = SHARE_SIZE_LONG
			this.shareSize.height = SHARE_SIZE_SHORT
		}

	}

	// --------------------------------------------------
	// ! layer

	toggleMenu() {

		var flag = this.$body.attr('data-status') === 'draw'

		this.$body.attr( 'data-status', flag ? 'menu' : 'draw' )
		this.togglePause( flag, true )
	}

	togglePause(paused, disableMessage) {

		this.isPaused = paused || !this.ca.uniforms.isPause.value
		this.ca.uniforms.isPause.value = this.isPaused

		if (this.isPaused) {
			this.isMouseDown = false
		}

		if (!disableMessage) {
			$('.layer--pause').toggleClass('is-visible', this.isPaused)
			this.$body.attr('data-status', this.isPaused ? 'layer' : 'draw')
		}
	}

	showHelp() {

		this.$body.attr('data-status', 'layer')
		this.togglePause(true, true)

		$('.layer--help').addClass('is-visible')
	}

	closeLayer() {

		this.$body.attr('data-status', 'draw')

		$('.layer').removeClass('is-visible')

		this.togglePause(false)
	}

	preventClosingLayer(e) {

		if ( !$(this).hasClass('is-passthru') ) {
			e.stopPropagation()
		}
	}

	// --------------------------------------------------
	// ! share

	showShare() {

		this.$body.attr('data-status', 'layer')

		this.togglePause(true, true)

		$('.layer--share')
			.attr('status', 'loading')
			.addClass('is-visible')

		$('.share-frame--top').css('bottom', window.innerHeight - this.shareRect.y * CELL_WIDTH )
		$('.share-frame--right').css('left', this.shareRect.z * CELL_WIDTH)
		$('.share-frame--bottom').css('top', this.shareRect.w * CELL_WIDTH)
		$('.share-frame--left').css('right', window.innerWidth - this.shareRect.x * CELL_WIDTH )

		$('.alert--url__btn--gallery').on('click', () => {

			this.closeShare( this.showGallery )
		})

		$('.alert--url__btn--resume').on('click', this.closeShare )


		// get map pixel data
		var pixels = this.ca.readPixels(
			this.shareRect.x, this.shareRect.y,
			this.shareSize.width, this.shareSize.height)

		if ( pixels === null ) {
			console.log('Error Occured')
			return
		}

		// disable alpha, and check if canvas is not empty
		let isFilled = 0x0
		const pixelCount = this.shareSize.width * this.shareSize.height

		for (let i = 0; i < pixelCount; i++) {
			pixels[i*4 + 3] = 255
			isFilled |= pixels[i*4] | pixels[i*4 + 1] | pixels[i*4 + 2]
		}

		if (!isFilled) {

			$('.alert--failed__content').html('Please draw something.')
			$('.layer--share').attr('status', 'failed')

			return
		}

		let mapImage = this.base64Util.convertArray(
			pixels,
			this.shareSize.width,
			this.shareSize.height)

		// get thumb pixel data
		pixels = this.mainCanvas.readPixels(
			this.resolution.x, this.resolution.y,
			this.shareRect.x, this.shareRect.y,
			this.shareSize.width, this.shareSize.height )

		if ( pixels === null ) {
			console.log('Error occured')
		}

		let thumbImage = this.base64Util.convertArray(
			this.shareSize.width, this.shareSize.height, pixels)

		let result

		// post data
		$.ajax({
			type: 'POST',
			url: './api/post.php',
			data: {
				map: mapImage,
				thumb: thumbImage
			},


			success: ( data ) => {

				console.log( data )

				let json

				try {
					json = JSON.parse(data)
				} catch (e) {
					console.log('JSON Parse Error')
				}

				if ( !(typeof json !== 'undefined' && json.status == 'OK') ) {
					result = 'failed'
					return
				}

				let url = URL + '?n=' + json.id

				let params = {
					url: url,
					text: `Fuse (No.${json.id })`
				}

				let intent = `https://twitter.com/intent/tweet?${$.param( params )}`

				$('.alert--complete__url').val(url)
				$('.alert--complete__tweet').attr('href', intent)

				result = 'complete'
			},

			error: () => {
				result = 'failed'
			},

			complete: () => {

				if (result == 'failed') {
					$('.alert--failed__content').html('Failed in sending data..')
				}

				setTimeout(() => {
					$('.layer--share').attr('status', result)
				}, 500)
			}
		})
	}

	closeShare(callback) {

		$('.share-frame').attr('style', '')
		$('.layer--share').attr('status', '')

		setTimeout(() => {

			this.$body.attr('data-status', 'draw')
			this.togglePause( false )
			$('.layer--share').removeClass('is-visible')

			if ( typeof callback === 'function') callback()

		}, 500)
	}

	tweet() {

		var windowOptions = 'scrollbars=yes,resizable=yes,toolbar=no,location=yes',
			width = 550,
			height = 420,
			winHeight = screen.height,
			winWidth = screen.width

		var left = Math.round((winWidth / 2) - (width / 2))
		var top = 0

		var url = $(this).attr('href')

		if (winHeight > height) {
			top = Math.round((winHeight / 2) - (height / 2))
		}

		window.open(url, 'intent', windowOptions + ',width=' + width +
					',height=' + height + ',left=' + left + ',top=' + top)


		return false
	}

	// --------------------------------------------------
	// ! gallery

	showGallery() {

		this.$body.attr('data-status', 'layer')
		this.togglePause(true, true)

		this.$gallery.addClass('is-visible')


		if (this.loadedPage == 0) {

			this.loadGallery()
		}
	}

	loadGallery() {

		this.$gallery.attr('data-status', 'loading')
		this.lockLoadingGallery = true

		$.getJSON('./api/get.php', {page: this.loadedPage}, (json) => {

			this.$gallery.attr('data-status', 'complete')

			switch (json) {

				case 'failed':
					return

				case 'empty':
					this.$gallery
						.attr('data-status', 'nomore')
						.off('scroll')
			}

			const content = json.content

			content.forEach((c) => {
				this.$galleryList.append(`
					<li data-id="${c.id}" data-map="./data/${c.map}">
						<img src="./data/${c.thumb}">
					</li>`)
			})

			this.lockLoadingGallery = false
		})


		this.loadedPage += 1
	}

	onScrollGallery() {
		scroll(this.evaluteLoadingGallery)
	}

	evaluteLoadingGallery() {
		if ( !this.lockLoadingGallery
			&& this.$gallery.scrollTop() + this.$gallery.innerHeight() >= this.$gallery[0].scrollHeight) {
			
			this.loadGallery()
		}
	}



	// --------------------------------------------------
	// ! control

	onClickTools(e) {
		const kind = $(e.target).data('kind')
		this.changeTool(kind)
	}

	changeTool(kind) {

		this.currentBrush = kind

		this.ca.uniforms.brushType.value = BRUSH_DATA[this.currentBrush].index
		this.ca.uniforms.brushSize.value = BRUSH_DATA[this.currentBrush].size

		let $elm = this.$tools.filter('[data-kind=' +kind+ ']')

		$elm.addClass('is-active')
		this.$tools.not($elm).removeClass('is-active')
	}

	// update shareRect, etc..
	updateResolution() {

		console.log('updateResolution')

		if ( this.$body.data('status') === 'menu' && window.innerWidth > MOBILE_WIDTH ) {

			this.$body.attr('data-status', 'draw' )
		}

		this.resolution.set(
			Math.ceil( window.innerWidth / CELL_WIDTH ),
			Math.ceil( window.innerHeight / CELL_WIDTH ))

		let x = Math.floor(( this.resolution.x - this.shareSize.width ) / 2)
		let y = Math.floor(( this.resolution.y - this.shareSize.height ) / 2)
		this.shareRect.set(x, y, x + this.shareSize.width, y + this.shareSize.height)

		window.renderer.setSize( window.innerWidth, window.innerHeight )

		this.ca.setResolution(this.resolution)
	}

	clearCanvas() {

		this.$body.attr('data-status', 'draw')

		if (md.mobile()) {
			setTimeout(() => {
				location.href = '.'
			}, 300)
			return
		}

		this.ca.clear()

		history.pushState({
			id: null,
			map: null
		}, null, '.' )

	}


	// --------------------------------------------------
	// ! map

	onPopState(e) {

		if ( !event || !event.state ) {
			return
		}

		console.log( e.originalEvent )

		if ( event.state.id ) {
			this.loadMap( event.state.id, event.state.map )
		} else {
			this.clearCanvas()
		}
	}

	loadMap(id, url) {

		this.$body.attr('data-status', 'loading')

		if (id instanceof $.Event) {

			id = $(this).data('id')
			url = $(this).data('map')
		}

		let map = new Image()

		map.onload = () => {

			this.buffCanvas.width = this.resolution.x
			this.buffCanvas.height = this.resolution.y

			let ctx = this.buffCanvas.getContext('2d')

			if ( this.isPortrait() ) {

				ctx.translate(this.shareRect.x, this.shareRect.w)
				ctx.rotate( -Math.PI / 2 )
				ctx.drawImage(map, 0, 0)

			} else {

				ctx.drawImage( map, this.shareRect.x, this.shareRect.y )
			}

			var texture = new THREE.Texture( this.buffCanvas )
			texture.needsUpdate = true

			this.ca.resetByTexture(texture)

			this.togglePause( true )

			history.pushState({
				id: id,
				map: url
			}, null, `?n=${id}`)
		}

		map.onerror = () => {

			console.log('loadMap(): an error occured')
			this.$body.attr('data-status', 'draw')
		}

		map.src = url
	}

	// --------------------------------------------------
	// ! mouse & keyboard event

	onMouseMove(e) {
		this.cntMouse.set(e.clientX, e.clientY)
	}

	onMouseDown() {
		this.isMouseDown = true
	}

	onMouseUp() {
		this.isMouseDown = false
	}

	onTouchMove(e) {

		e.preventDefault()
		this.cntMouse.set(
			event.changedTouches[0].pageX,
			event.changedTouches[0].pageY)
	}

	onTouchStart(e) {
		e.preventDefault()
		this.cntMouse.set(event.changedTouches[0].pageX, event.changedTouches[0].pageY)
		this.ca.uniforms.cntMouse.value.set(
			this.cntMouse.x / CELL_WIDTH,
			this.cntMouse.y / CELL_WIDTH)
		this.isMouseDown = true

	}

	onTouchEnd(e) {
		e.preventDefault()
		this.cntMouse.set(event.changedTouches[0].pageX, event.changedTouches[0].pageY)
		this.isMouseDown = false

	}

	onKeyUp(e) {

		var key = String.fromCharCode( e.keyCode )

		switch( key ) {
			case ' ':
				if (this.$body.data('status') === 'draw') {
					this.togglePause()
				}
				break
			case 's':
			case 'S':
				this.showShare()
				break
			case '1':
				this.changeTool('Fuse')
				break
			case '2':
				this.changeTool('Bomb')
				break
			case '3':
				this.changeTool('Fire')
				break
			case '4':
				this.changeTool('Wall')
				break
			case '5':
				this.changeTool('Ersr')
				break
		}

		if ( e.keyCode == 38 ) {
			BRUSH_DATA[this.currentBrush].size += 2.0
			this.changeTool(this.currentBrush)
		} else if ( e.keyCode == 40 ) {
			BRUSH_DATA[this.currentBrush].size = Math.max(1, BRUSH_DATA[this.currentBrush].size - 2.0)
			this.changeTool(this.currentBrush)
		}
	}

	// --------------------------------------------------
	// ! draw
	draw() {

		if (this.isPaused) {
			return
		}

		this.ca.uniforms.isMouseDown.value = this.isMouseDown
		this.ca.uniforms.prevMouse.value.copy(this.ca.uniforms.cntMouse.value)
		this.ca.uniforms.cntMouse.value.set(
			this.cntMouse.x / CELL_WIDTH,
			this.cntMouse.y / CELL_WIDTH)

		this.ca.update()
		this.shader.uniforms.buffer.value = this.ca.texture
		this.mainCanvas.render()
	}

	// --------------------------------------------------
	// ! utils

	

}

$(function() {
	new App()
})