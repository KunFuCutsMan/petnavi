const sleep = (ms = 2000) => new Promise( (r) => setTimeout(r, ms) )

const inquirer = require('inquirer')

/**
 * BattleUI will handle anything visual from the BattleManager
 * including question handling
*/
module.exports = class BattleUI {

	constructor( empty ) {
		this.ui = require('cliui')({ width: 60 })
		this.EMPTY_SPACE = empty
	}

	async askActionPrompt() {
		const answerAction = await inquirer.prompt({
			type: 'list',
			name: 'action',
			message: 'What will you do?',
			choices: [
			'Attack', 'Cyber Actions',
			'Defend', new inquirer.Separator() , 'Escape'
			],
			loop: true,
			pageSize: 5
		})
		return answerAction.action
	}

	async askChooseChip(CPattacks) {
		const answerCPAttk = await inquirer.prompt({
			type: 'list',
			name: 'cpattk',
			message: 'Choose your Chip:',
			choices: CPattacks,
			pageSize: 15,
			loop: true,
		})
		return answerCPAttk.cpattk
	}

	async askTarget(eList) {
		const answerTarget = await inquirer.prompt({
			type: 'list',
			name: 'target',
			message: 'Attack Who?',
			choices: eList.filter( i => i !== this.EMPTY_SPACE),
			loop: false,
		})
		return answerTarget.target
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

	addNaviChips(cpattks) {
		this.ui.div(
			{text: 'CHIPS:', align: 'left', padding: [0, 0, 0, 8]},
			{text: ''})

		// Get the navi's CPattacks arranged neatly into 4 cols
		for (let i = 0; i <= cpattks.length; i+=4 ) {
			const chip1 = cpattks[i] ? cpattks[i] : ''
			const chip2 = cpattks[i+1] ? cpattks[i+1] : ''
			const chip3 = cpattks[i+2] ? cpattks[i+2] : ''
			const chip4 = cpattks[i+3] ? cpattks[i+3] : ''

			this.ui.div(
				{text: chip1, align: 'center'},
				{text: chip2, align: 'center'},
				{text: chip3, align: 'center'},
				{text: chip4, align: 'center'} )
		}
	}

	addZenny(z) {
		this.ui.div(
			{text: 'ZENNY: ' + z, align: 'left', padding: [0, 0, 0, 8]},
			{text: ''}
		)
	}

	addNaviChipLibrary(lib) {
		this.ui.div(
			{text: 'CHIP LIBRARY:', align: 'left', padding: [0, 0, 0, 8]},
			{text: ''}
		)

		// Get the navi's library arranged neatly into 4 cols
		for (let i = 0; i <= lib.length; i+=4 ) {
			const chip1 = lib[i] ? lib[i] : ''
			const chip2 = lib[i+1] ? lib[i+1] : ''
			const chip3 = lib[i+2] ? lib[i+2] : ''
			const chip4 = lib[i+3] ? lib[i+3] : ''

			this.ui.div(
				{text: chip1, align: 'center'},
				{text: chip2, align: 'center'},
				{text: chip3, align: 'center'},
				{text: chip4, align: 'center'}
			)
		}
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

	getFullNaviCard(navi) {
		this.addBar()
		this.addVoid()
		this.addNaviStats(navi)
		this.addVoid()
		this.addNaviChips(navi.CPattacks)
		this.addVoid()
		this.addZenny(navi.zenny)
		this.addVoid()
		this.addNaviChipLibrary(navi.chipLibrary)
		this.addVoid()
		this.addBar()

		return this.getUIstring()
	}

	resetUI() {
		this.ui.resetOutput()
	}

	resetScreen() {
		this.resetUI()
		console.clear()
	}
}