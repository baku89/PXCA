Vue.use(require('vue-infinite-scroll'))

const state = window.state
const router = window.router

export default class GalleryManager {

	constructor() {

		this.$gallery = $('.gallery')
		this.$galleryList = $('.gallery__list')

		let count = 0

		new Vue({
			el: '.gallery',
			data: {
				items: [],
				busy: false,
				next: './api/get.php'
			},
			methods: {
				loadMore() {
					this.busy = true

					$.getJSON(this.next, (res) => {

						this.next = res.next

						res.items.forEach((item) => {
							this.items.push(item)
						})

						setTimeout(() => {
							this.busy = false
						}, 100)

					})
				},

				loadMap(e, item) {
					router.id = item.id
					state.loadMap(item.map)
				}

			}
		})
		
	}

}