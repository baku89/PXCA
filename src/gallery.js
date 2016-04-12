Vue.use(require('vue-infinite-scroll'))

const state = window.state

export default class GalleryManager extends Vue {

	constructor() {

		super({
			el: '.gallery',
			data: {
				items: [],
				busy: false,
				next: './api/gallery.php'
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
					state.loadMap(item.map)
				}

			}
		})
		
	}

}

