const inquirer = require('inquirer')

const ViewerUI = require('./ViewerUI')

const sleep = (ms = 2000) => new Promise( (r) => setTimeout(r, ms) )

/**
 * BattleUI will handle anything visual from the BattleManager
 * including question handling
*/
module.exports = class BattleUI extends ViewerUI {

	constructor( empty, w = 60 ) {
		super(w)
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