const sleep = (ms = 2000) => new Promise( (r) => setTimeout(r, ms) )

module.exports = class BattleUI {

	constructor( empty ) {
		this.ui = require('cliui')({ width: 60 })
		this.EMPTY_SPACE = empty
	}

	async logActionQueue(aq, isOver) {
		for (const str of aq) {
			console.log('> '+str)
			await sleep(750)
		}

		// Let the player read what happened
		if ( !isOver )
			await sleep(1500)
	}

	addVoid() {
		this.ui.div('')
	}

	addBar() {
		let str = ''
		for (let i = 0; i < 60; i++)
			str += '='

		this.ui.div({text: str, padding: [0, 0, 0, 0]})
	}
	
	addEnemyListUI(eList) {
		for (const enemy of eList) {
			let r1 = { text: '[        ]', align: 'left', padding: [0, 0, 0, 8] }
			let r2 = { text: '[        ]', align: 'left' }

			if (enemy !== this.EMPTY_SPACE) {
				r1.text = enemy.name
				r2.text = 'HP: ' + enemy.HP +' / '+ enemy.maxHP
			}
			
			this.ui.div( r1, r2 )
		}
	}

	addNaviStats(navi) {
		this.ui.div(
			{ text: navi.name , align: 'center' },
			{ text: navi.core , align: 'center' } )

		this.ui.div(
			{ text: 'HP: '+navi.HP+' / '+navi.maxHP , align: 'center' },
			{ text: 'CP: '+navi.CP+' / '+navi.maxCP , align: 'center' } )
	}

	getUIstring() {
		return this.ui.toString()
	}

	getBattleUI(navi, enemyList) {
		this.addVoid()
		this.addEnemyListUI(enemyList)
		this.addVoid()
		this.addBar()
		this.addVoid()
		this.addNaviStats(navi)
		this.addVoid()

		return this.getUIstring()
	}

	resetUI() {
		this.ui.resetOutput()
	}
}