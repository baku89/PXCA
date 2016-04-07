import StateMachine from 'javascript-state-machine'

let $body = $('body')

window.state = StateMachine.create({
	initial: 'loading',
	events: [
		{name: 'pause',				from: 'draw',	to: 'paused'},
		{name: 'resume',			from: ['loading', 'posting', 'paused', 'gallery', 'share', 'help', 'menu'], to: 'draw'},
		{name: 'expandMenu', 	from: 'draw', to: 'menu'},
		{name: 'showGallery', from: ['draw', 'menu', 'share'], to: 'gallery'},
		{name: 'showHelp',		from: ['draw', 'menu'], to: 'help'},
		{name: 'postMap',			from: ['draw', 'menu'], to: 'posting'},
		{name: 'showShare',		from: 'posting', to: 'share'},
		{name: 'loadMap',			from: ['loading', 'gallery'], to: 'loading'},
		{name: 'previewMap',	from: 'loading', to: 'paused'}
	],
	callbacks: {
		onenterstate: (evt, from, to) => {
			$body.attr('data-status', to)
		}
	}
})