import StateMachine from 'javascript-state-machine'
import Config from './config.js'

const state = window.state

const OUTER_OPACITY = {
	draw: 0.93,
	preview: 0.5,
	share: 0,
	frames: 10
}

export default class Share {

	constructor() {

		$('.menu__share').on({
			'mouseenter': () => {
				this.setOuterOpacity(OUTER_OPACITY.preview)	
			},
			'mouseleave': () => {
				if (state.current != 'share')
					this.setOuterOpacity(OUTER_OPACITY.draw)
			}
		})

		this.alert = new Vue({
			el: '.alert',
			data: {
				show: false,
				status: '',
				message: '',
				url: '',
				id: null
			},
			methods: {
				resume() { state.resume() },
				showGallery() { state.showGallery() },
				tweet() {
					let windowOptions = 'scrollbars=yes,resizable=yes,toolbar=no,location=yes',
						width = 550,
						height = 420,
						winHeight = screen.height,
						winWidth = screen.width
			
					let left = Math.round((winWidth / 2) - (width / 2))
					let top = 0
			
					if (winHeight > height)
						top = Math.round((winHeight / 2) - (height / 2))
				
					let params = {
						url: this.url,
						text: `Fuse #${this.id}`
					}
			
					let intentUrl = `https://twitter.com/intent/tweet?${$.param(params)}`
				
					window.open(intentUrl, 'intent', 
						`${windowOptions},width=${width},height=${height},left=${left},top=${top}`)
				}
			}
		})


		state.onposting = (s) => {
			this.setOuterOpacity(OUTER_OPACITY.share)
		}

		state.onshowShare = this.onShowShare.bind(this.alert)

		state.onleaveshare = () => {
			this.alert.$data.show = false
			this.setOuterOpacity(OUTER_OPACITY.draw)	

			setTimeout(() => state.transition(), 550)
			
			return StateMachine.ASYNC
		}
	}

	get rect() {
		return this.uniforms.shareRect.value
	}

	updateUniforms(uniforms) {
		this.uniforms = uniforms
		this.uniforms.outerOpacity.value = OUTER_OPACITY.draw
	}


	updateResolution(w, h) {
		let x = Math.floor((w - Config.SHARE_WIDTH) / 2)
		let y = Math.floor((h - Config.SHARE_HEIGHT) / 2)
		this.uniforms.shareRect.value.set(x, y, x + Config.SHARE_WIDTH, y + Config.SHARE_HEIGHT)
	}

	setOuterOpacity(target) {

		let current = this.uniforms.outerOpacity.value
		let step = Math.abs(target - current) / OUTER_OPACITY.frames

		if (target < current) {
			step *= -1
		}

		let isEnd = current <= target
			? function(current, target) {return target <= current}
			: function(current, target) {return current <= target}

		clearInterval(this.outerOpacityTimer)

		this.outerOpacityTimer = setInterval(() => {

			let value = this.uniforms.outerOpacity.value + step
			
			if (isEnd(value, target)) {
				value = target
				clearInterval(this.outerOpacityTimer)
			}

			this.uniforms.outerOpacity.value = value

		}, 20)

	}

	onShowShare(event, from, to, res) {
		
		if (res.status == 'failed') {
			this.message = res.content.message

		} else if (res.status == 'succeed') {
			this.url = res.content.url
			this.id = res.content.id

		}

		this.status = res.status

		console.log(this.status)
		this.show = true
	}
}