const Enquirer = require('enquirer')

const attackInfo = require('../utils/AttackInfo')
const PaginatorUI = require('./PaginatorUI')
const ViewerUI = require('./ViewerUI')


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
			// do stuff
			break
		}

		// And repeat until we wish to go back
		if ( action !== 'Exit' )
			await this.showMenu( navi )
	}

	async askChipLibrary( lib, cpattks ) {
		const libVals = []
		for (const chip in lib) {
			libVals.push({
				name: '' + chip + ' x' + lib[chip],
				value: chip
			})
		}

		const cpattksIndexes = []
		let i = 0;
		for (const chip of cpattks) {
			cpattksIndexes.push({
				name: '' + chip,
				value: i
			})
			i++
		}

		const swapChipsQuestion = await inquirer.prompt([ {
				type: 'list',
				name: 'chipToSwap',
				message: 'What chip would you like to use?',
				choices: libVals
			}, {
				type: 'list',
				name: 'indexOfChipPlace',
				message: "You\'ve reached the maximum amount of chips in your folder,\nselect one chip to swap it with:",
				choices: cpattksIndexes,
				pageSize: 12,
				loop: false,
				when(prevAnswers) {
					return cpattksIndexes.length >= 12
				}
			}
		])

		return swapChipsQuestion;
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
			const chip = attackInfo(chipName)
			i++;

			this.ui.div(
				{text: i, align: 'center'},
				{text: chip.type, align: 'left' },
				{text: chip.name, align: 'left'},
				{text: chip.target, align: 'left'},
				{text: chip.attackValue.reduce( (c, i) => c += ' ' + i ),
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