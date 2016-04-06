import Config from './config.js'

const state = window.state

const OUTER_OPACITY = {
	draw: 0.93,
	preview: 0.5,
	share: 0,
	step: 0.04
}

export default class ShareUI {

	constructor() {

		tihs.$alert = $('.alert')

		$('.menu__share').on({
			'mouseenter': () => {
				this.setOuterOpacity(OUTER_OPACITY.preview)	
			},
			'mouseleave': () => {
				this.setOuterOpacity(OUTER_OPACITY.draw)
			}
		})


		state.onentershare = () => {
			this.setOuterOpacity(OUTER_OPACITY.share)
			this.postMap()

		}

		state.onleaveshare = () => {
			this.setOuterOpacity(OUTER_OPACITY.draw)
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

		let step = this.uniforms.outerOpacity.value <= target
			? OUTER_OPACITY.step
			: OUTER_OPACITY.step * -1

		let isEnd = this.uniforms.outerOpacity.value <= target
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

		}, 40)
	}


}