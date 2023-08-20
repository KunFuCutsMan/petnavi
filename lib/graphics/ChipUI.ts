import Enquirer from "enquirer";
import { PaginatorUI } from "./PaginatorUI";
import { ViewerUI } from "./ViewerUI";
import { Navi } from "../classes/navi";
import { getChipInfo } from "../utils/chipAttackInfo";
import { getColorFromColorType } from "./colorFromType";

type Answers = {
	[K: string]: any
}

// Taken from the enquirer index.d.ts
interface Choice {
	name: string
	message?: string
	value?: string
	hint?: string
	disabled?: boolean | string
}

export class ChipUI extends ViewerUI {

	enq: Enquirer

	constructor( w: number ) {
		super(w)
		this.enq = new Enquirer()
	}

	async showMenu( navi: Navi ) {
		this.resetScreen()

		// What will you do?
		const actions: Answers = await this.enq.prompt({
			type: 'select',
			name: 'action',
			message:  `${this.getCPattackList( navi.attacksCP )}\nWhat will you do?`,
			choices: [ 'View Chips', 'Change Folder', 'Exit' ],
		})

		switch ( actions.action as string ) {
		case 'View Chips':
			// Show the paginator of our current chip library
			const pag = new PaginatorUI( 80, navi.chipLibrary )
			await pag.showPaginatorMenu()
			break

		case 'Change Folder':
			await this.askAboutSwappingChips( navi )
			break
		}

		// And repeat until we wish to go back
		if ( actions.action !== 'Exit' )
			await this.showMenu( navi )
	}

	async askAboutSwappingChips( navi: Navi ) {

		const answers: Answers = await this.enq.prompt([
			{
				type: 'select',
				name: 'positionOfChipLibrary',
				message: 'What chip would you like to add?',
				choices: this.toChoiceArray( navi.chipLibrary )
			},
			{
				type: 'select',
				name: 'positionOfAttackCP',
				message: `You cannot use more than 12 chips in a folder\nSelect one chip to swap it with`,
				choices: this.toChoiceArray( navi.attacksCP ),
				skip: !navi.isCPattacksFull(),
			}
		])
		
		this.changeOrAddChips( answers, navi )
	}

	toChoiceArray( array: string[] ): Choice[] {
		return array.map<Choice>( (v, i) => {
			return {
				// For some OTHER reason enquirer gives you the NAME
				// of the choice instead of its VALUE so THAT line is useless
				name: `${i}`,
				message: v,
			}
		})
	}

	changeOrAddChips(ans: Answers, navi: Navi) {
	
		if ( !navi.isCPattacksFull() ) {
			// Add the chip
			navi.addToCPattacks( navi.popChipLibraryWithIndex( ans.positionOfChipLibrary as number - 1 ) )
		}
		else {
			// Accounting for the 0 value bug in enquirer
			navi.switchCPAttackWithChipInLibrary(
				ans.positionOfAttackCP as number,
				ans.positionOfChipLibrary as number)
		}
	}

	addNaviChipDetails(cpattks: string[]) {
		this.ui.div(
			{text: '#', padding: [0,0,0,0], align: 'center' },
			{text: 'Type:', padding: [0,0,0,0], align: 'center' },
			{text: 'Chip:', padding: [0,0,0,0], align: 'center' },
			{text: 'Target:', padding: [0,0,0,0], align: 'center' },
			{text: 'Damage:', padding: [0,0,0,4], align: 'left' }
		)

		let i = 0;
		for (const chipName of cpattks) {
			const chip = getChipInfo(chipName)
			i++;

			const color = getColorFromColorType( chip.type )

			this.ui.div(
				{text: `${i}`, padding: [0,0,0,0], align: 'center'},
				{text: color( chip.type ), padding: [0,0,0,0], align: 'left' },
				{text: color( chip.name ), padding: [0,0,0,0], align: 'left'},
				{text: color( chip.target ), padding: [0,0,0,0], align: 'left'},
				{text: color(chip.attackValue.map(n => `${n}`).reduce((acc, str) => `${acc} ${str}`)),
					align: 'center', padding: [0, 4, 0, 0] },
			)
		}
	}

	addNaviChipLibrary(lib: string[]) {
		this.ui.div(
			{text: 'CHIP LIBRARY:', align: 'left', padding: [0, 0, 0, 8]},
			{text: '', padding: [0,0,0,0]}
		)

		// Get the navi's library arranged neatly into 4 cols
		for (let i = 0; i <= lib.length; i+=4 ) {
			const chip1 = lib[i] ?? ''
			const chip2 = lib[i+1] ?? ''
			const chip3 = lib[i+2] ?? ''
			const chip4 = lib[i+3] ?? ''

			this.ui.div(
				{text: chip1, padding: [0,0,0,0], align: 'center'},
				{text: chip2, padding: [0,0,0,0], align: 'center'},
				{text: chip3, padding: [0,0,0,0], align: 'center'},
				{text: chip4, padding: [0,0,0,0], align: 'center'}
			)
		}
	}

	getCPattackList(cpattks: string[]) {
		this.addBar()
		this.addVoid()
		this.addNaviChipDetails(cpattks)
		this.addVoid()
		this.addBar()
		this.addVoid()

		return this.getUIstring()
	}

}