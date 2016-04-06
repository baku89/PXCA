import StateMachine from 'javascript-state-machine'

let $body = $('body')

window.state = StateMachine.create({
	initial: 'loading',
	events: [
		{name: 'pause',				from: 'draw',	to: 'paused'},
		{name: 'resume',			from: ['loading', 'paused', 'gallery', 'share', 'help'], to: 'draw'},
		{name: 'expandMenu', 	from: 'draw', to: 'menu'},
		{name: 'foldMenu',   	from: 'menu', to: 'draw'},
		{name: 'showGallery', from: ['draw', 'menu'], to: 'gallery'},
		{name: 'showHelp',		from: ['draw', 'menu'], to: 'help'},
		{name: 'showShare',		from: ['draw', 'menu'], to: 'share'},
		{name: 'loadMap',			from: 'gallery', to: 'loading'},
		{name: 'mapLoaded',		from: 'loading', to: 'paused'}
	],
	callbacks: {
		onenterstate: (evt, from, to) => {
			$body.attr('data-status', to)
		}
	}
})