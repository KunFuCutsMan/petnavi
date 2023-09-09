import Enquirer from "enquirer";
import { Navi } from "../classes/navi";
import { EmptySpace } from "../classes/EmptySpace";
import { Enemy } from "../classes/enemy";
import { ViewerUI } from "./ViewerUI";
import { getChipInfo } from "../utils/chipAttackInfo";
import { getColorFromColorType } from "./colorFromType";
import { Status, StatusList, StatusType } from "../classes/statusEffect";

/**
 * BattleUI will handle anything visual from the BattleManager
 * including question handling
*/
export class BattleUI extends ViewerUI {

	readonly enq: Enquirer< Record<string, string> >

	constructor( w = 80 ) {
		super(w)
		this.enq = new Enquirer()
	}

	async showMenuAndAskActions(navi: Navi, enemyList: Array<Enemy | EmptySpace>): Promise<Record<string, string>> {
		// Reset screen
		this.resetScreen()

		const ui = this.getBattleUI( navi, enemyList )

		const { action } = await this.enq.prompt({
			type: 'select',
			name: 'action',
			message: `${ui}\nWhat will you do?`,
			choices: [
				{ name: 'Attack', value: 'Attack' },
				{ name: 'Cyber Actions', value: 'Cyber Actions' },
				{ name: 'Defend', value: 'Defend' },
				{ name: 'Escape', value: 'Escape' }
			]
		})
		
		const { cpattk } = await this.enq.prompt({
			type: 'select',
			name: 'cpattk',
			message: 'Choose your chip: ',
			choices: navi.attacksCP.map( c => {
				return { name: c, value: c }
			}),
			skip: action !== 'Cyber Actions'
		})
		
		const { target } = await this.enq.prompt({
			type: 'select',
			name: 'target',
			message: 'Aim at',
			choices: enemyList
				.filter( (e): e is Enemy => e instanceof Enemy )
				.map( (e: Enemy) => {
					return { name: e.name, value: e.name, }
				}),
			
			skip: () => {
				const chip = getChipInfo( cpattk )
				// Boolean flags for not making spaguetti
				const a = action === 'Attack'
				const b = action === 'Cyber Actions'
				const c = chip.canTarget === true
				return !( a || ( b && c ) )
			}
		})

		return { action, cpattk, target }
	}
	
	private addEnemyListUI(eList: Array< Enemy | EmptySpace >) {

		for (const enemy of eList) {
			let r1 = ''
			let r2 = ''
			let r3 = ''

			if (enemy instanceof EmptySpace) {
				r1 = enemy.toString()
				r2 = enemy.toString()
			}
			else if ( enemy instanceof Enemy ) {
				const color = getColorFromColorType( enemy.core.coreType )

				r1 = color( enemy.name )
				r2 = color(`HP: ${enemy.HP} / ${enemy.maxHP}`)
				r3 = this.enemyStatusStr( enemy.statusList )
			}
			
			this.ui.div(
				{ text: r1, align: 'left', padding: [0,0,0,8] },
				{ text: r2, align: 'right', padding: [0,2,0,0] },
				{ text: r3, align: 'left', padding: [0,0,0,2] } )
		}
	}

	private enemyStatusStr( statHash: StatusList ): string {
		let str = ''

		for (const stat in statHash) {
			const status = statHash[stat as StatusType]

			let c = status?.counter ?? 0

			while(c >= 0) {
				str += status!.symbol
				c--
			}

			str += ' '
		}

		return str
	}

	getBattleUI(navi: Navi, enemyList: Array<Enemy | EmptySpace>) {
		this.addVoid()
		this.addEnemyListUI(enemyList)
		this.addVoid()
		this.addBar()
		this.addVoid()
		this.addNaviStats(navi)
		this.addVoid()

		return this.getUIstring()
	}
}