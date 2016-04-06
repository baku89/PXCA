import StateMachine from 'javascript-state-machine'

let $body = $('body')

window.state = StateMachine.create({
	initial: 'loading',
	events: [
		{name: 'assetsLoaded',from: 'loading', to: 'draw'},
		{name: 'pause',				from: 'draw',	to: 'paused'},
		{name: 'expandMenu', 	from: 'draw', to: 'menu'},
		{name: 'foldMenu',   	from: 'menu', to: 'draw'},
		{name: 'showGallery', from: ['draw', 'menu'], to: 'gallery'},
		{name: 'showHelp',		from: ['draw', 'menu'], to: 'help'},
		{name: 'resume',			from: ['paused', 'gallery', 'help'], to: 'draw'}
	],
	callbacks: {
		onenterstate: (evt, from, to) => {
			$body.attr('data-status', to)
		}
	}
})