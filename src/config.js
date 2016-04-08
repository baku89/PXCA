
import MobileDetect from 'mobile-detect'



let md = new MobileDetect(window.navigator.userAgent)
let isPC = !md.mobile()

export default {
	PC: isPC,
	CELL_WIDTH: isPC ? 4 : 2,
	MOBILE_WIDTH: 960,
	SHARE_WIDTH: 240,
	SHARE_HEIGHT: 160
}