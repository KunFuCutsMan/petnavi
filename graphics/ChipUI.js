const Enquirer = require('enquirer')

const PaginatorUI = require('./PaginatorUI')
const ViewerUI = require('./ViewerUI')
const colorFromType = require('./colorFromType')
const { Chip } = require('../classes')

const sleep = async ( ms = 2000 ) => new Promise( r => setTimeout(r, ms) )


module.exports = class ChipUI extends ViewerUI {

	constructor(w) {
		super(w)
		this.enq = new Enquirer()
		this.enq.register( 'selectAfterText', require('./enquirer/SelectAfterText') )
	}

	async showMenu( navi ) {
		this.resetScreen()

		// What will you do?
		let { action } = await this.enq.prompt({
			type: 'selectaftertext',
			name: 'action',
			message: 'What will you do?',
			textToShow: this.getCPattackList( navi.CPattacks ),
			choices: [ 'View Chips', 'Change Folder', 'Exit' ],
		})

		switch (action) {
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
		if ( action !== 'Exit' )
			await this.showMenu( navi )
	}

	async askAboutSwappingChips( navi ) {

		const answers = await this.enq.prompt([
			{
				type: 'select',
				name: 'positionChipLibrary',
				message: 'What chip would you like to add?',
				choices: this.toChoiceArray( navi.chipLibrary ),
				result() {
					return this.focused.value
				}
			}, {
				type: 'selectaftertext',
				name: 'positionChipCPattk',
				textToShow: 'You cannot use more than 12 chips in a folder',
				message: "Select one chip to swap it with",
				choices: this.toChoiceArray( navi.CPattacks ),
				skip: !navi.isCPattacksFull(),
				result() {
					return this.focused.value
				}
			}
		])
		
		this.changeOrAddChips( answers, navi )
	}

	toChoiceArray( array ) {
		const choiceArray = []
		for (let i = 0; i < array.length; i++) {
			choiceArray.push({
				name: array[i] + '-' + i,
				message: array[i],
				value: i + 1 // For some reason enquirer breaks on a value of 0
			})
		}

		return choiceArray
	}

	changeOrAddChips(ans, navi) {
	
		if ( !navi.isCPattacksFull() ) {
			// Add the chip
			navi.addToCPattacks( navi.popChipLibraryWithIndex( ans.positionChipLibrary - 1 ) )
		}
		else {
			// Accounting for the 0 value bug in enquirer
			navi.switchCPAttackWithChipInLibrary(
				ans.positionChipCPattk - 1,
				ans.positionChipLibrary - 1)
		}
	}

	addNaviChipDetails(cpattks) {
		this.ui.div(
			{text: '#', align: 'center'},
			{text: 'Type:', align: 'center'},
			{text: 'Chip:', align: 'center'},
			{text: 'Target:', align: 'center'},
			{text: 'Damage:', align: 'left', padding: [0, 0, 0, 4] }
		)

		let i = 0;
		for (const chipName of cpattks) {
			const chip = new Chip(chipName)
			i++;

			const color = colorFromType( chip.type.type )

			this.ui.div(
				{text: i, align: 'center'},
				{text: color( chip.type.type ), align: 'left' },
				{text: color( chip.name ), align: 'left'},
				{text: color( chip.target ), align: 'left'},
				{text: color( chip.attackValue.reduce( (c, i) => c += ' ' + i ) ),
					align: 'center', padding: [0, 4, 0, 0] },
			)
		}
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

	getCPattackList(cpattks) {
		this.addBar()
		this.addVoid()
		this.addNaviChipDetails(cpattks)
		this.addVoid()
		this.addBar()
		this.addVoid()

		return this.getUIstring()
	}

}