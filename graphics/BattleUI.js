const Enquirer = require('enquirer')

const ViewerUI = require('./ViewerUI')
const colorFromType = require('./colorFromType')
const { Enemy, EmptySpace, Chip } = require('../classes')
const sleep = (ms = 2000) => new Promise( (r) => setTimeout(r, ms) )

/**
 * BattleUI will handle anything visual from the BattleManager
 * including question handling
*/
module.exports = class BattleUI extends ViewerUI {

	constructor( w = 80 ) {
		super(w)
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

		// Normalize the choice array of targets
		const normalizedEnemyChoices = enemyList
			.filter( e => e instanceof Enemy)
			.map( e => {
				return { message: e.name, value: e.name }
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
				choices: normalizedEnemyChoices,
				
				skip: function() {
					const chip = new Chip( this.state.answers['cpattk'] )

					// Boolean flags for not making spaguetti
					const a = this.state.answers['action'] === 'Attack'
					const b = this.state.answers['action'] === 'Cyber Actions'
					const c = chip.canTarget === true

					return !( a || ( b && c ) )
				}
			}
		]);
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
			let r1 = { align: 'left', padding: [0, 0, 0, 8] }
			let r2 = { align: 'right', padding: [0, 2, 0, 0] }
			let r3 = { text: '', align: 'left', padding: [0, 0, 0, 2] }

			if (enemy instanceof EmptySpace) {
				r1.text = enemy.toString()
				r2.text = enemy.toString()
			}
			else if ( enemy instanceof Enemy ) {
				const color = colorFromType( enemy.Core.type )

				r1.text = color( enemy.name )
				r2.text = color( 'HP: ' + enemy.HP +' / '+ enemy.maxHP )
				r3.text = this.enemyStatusStr( enemy.statusList )
			}
			
			this.ui.div( r1, r2, r3 )
		}
	}

	enemyStatusStr( statHash ) {
		let str = ''

		for (const stat in statHash) {

			let c = statHash[stat].counter

			while(c >= 0) {
				str += statHash[stat].symbol
				c--
			}

			str += ' '
		}

		return str
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