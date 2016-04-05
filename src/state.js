import StateMachine from 'javascript-state-machine'

let $body = $('body')

window.state = StateMachine.create({
	initial: 'drawing',
	events: [
		{name: 'expandMenu', 	from: 'draw', to: 'menu'},
		{name: 'foldMenu',   	from: 'menu', to: 'draw'},
		{name: 'showGallery', from: ['draw', 'menu'], to: 'gallery'},
		{name: 'hideGallery', from: 'gallery', to: 'draw'},
		{name: 'showHelp',		from: ['draw', 'menu'], to: 'help'},
		{name: 'hideHelp',		from: 'help', to: 'draw'}
	],
	callbacks: {
		onenterstate: (evt, from, to) => {
			$body.attr('data-status', to)
		}
	}
})