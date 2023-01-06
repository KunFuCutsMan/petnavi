const Enquirer = require('enquirer')

const ViewerUI = require('./ViewerUI')
const attackInfo = require('../utils/AttackInfo')
const sleep = (ms = 2000) => new Promise( (r) => setTimeout(r, ms) )

/**
 * BattleUI will handle anything visual from the BattleManager
 * including question handling
*/
module.exports = class BattleUI extends ViewerUI {

	constructor( empty, w = 60 ) {
		super(w)
		this.EMPTY_SPACE = empty
		this.enq = new Enquirer()
		this.enq.register( 'selectAfterText', require('./enquirer/SelectAfterText') )
	}

	async showMenuAndAskActions(navi, enemyList) {
		// Reset screen
		this.resetScreen()

		// Normalize the choice array of 'cpattk' select question
		const chipInstances = {}
		const normalizedChipChoices = navi.CPattacks.map( c => {
			return { message: c, value: c }
		} )

		return await this.enq.prompt([
			{
				type: 'selectaftertext',
				name: 'action',
				message: 'What will you do?',
				textToShow: this.getBattleUI( navi, enemyList ),
				choices: [
					{ name: 'Attack', value: 'Attack' },
					{ name: 'Cyber Actions', value: 'Cyber Actions' },
					{ name: 'Defend', value: 'Defend' },
					{ role: 'separator' },
					{ name: 'Escape', value: 'Escape' }
				]
			}, {
				type: 'select',
				name: 'cpattk',
				message: 'Choose your chip',
				choices: normalizedChipChoices,
				
				skip: function() {
					return this.state.answers['action'] !== 'Cyber Actions'
				}
			}, {
				type: 'select',
				name: 'target',
				message: 'Aim at',
				choices: enemyList.filter( i => i !== this.EMPTY_SPACE),
				
				skip: function() {
					const chip = attackInfo( this.state.answers['cpattk'] )

					// Boolean flags for not making spaguetti
					const a = this.state.answers['action'] === 'Attack'
					const b = this.state.answers['action'] === 'Cyber Actions'
					const c = chip.canTarget === true

					return !( a || ( b && c ) )
				}
			}
		]);
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

	countInstancesInArray(array) {
		const countObj = {}
		
		for (const thing of array) {
			if ( countObj[thing] == undefined )
				countObj[thing] = 1
			else countObj[thing]++
		}

		return countObj
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