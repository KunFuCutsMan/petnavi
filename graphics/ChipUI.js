const Enquirer = require('enquirer')

const attackInfo = require('../utils/AttackInfo')
const PaginatorUI = require('./PaginatorUI')
const ViewerUI = require('./ViewerUI')

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

		const amountOfInstances = this.countInstancesInArray( navi.chipLibrary )
		
		// Get all the chips that the navi has
		const libraryValues = []
		for (const chip in amountOfInstances) {
			libraryValues.push({
				name: chip, value: chip,
				message:  chip + ' x' + amountOfInstances[chip],
			})
		}

		// And the index of the chip to be swapped, if it happens
		const cpattksIndexes = []
		let i = 0;
		for (const chipName of navi.CPattacks) {
			cpattksIndexes.push({
				name: chipName + i,
				message: chipName,
				value: '' + i + ''
			})
			i++
		}

		const answers = await this.enq.prompt([
			{
				type: 'select',
				name: 'chipAdded',
				message: 'What chip would you like to add?',
				choices: libraryValues
			}, {
				type: 'selectaftertext',
				name: 'chipToSwap',
				textToShow: 'You cannot use more than 12 chips in a folder',
				message: "Select one chip to swap it with",
				choices: cpattksIndexes,
				skip: cpattksIndexes.length < 12,
			}
		])

		this.changeOrAddChips( answers, navi, cpattksIndexes )
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

	changeOrAddChips(answers, navi, cpattksIndexes) {
	
		if ( navi.CPattacks.length < 12 ) {
			// Add the chip
			navi.CPattacks.push( answers.chipAdded )
		}
		else {
			const idxToSwap = this.findIndexOf( cpattksIndexes, answers.chipToSwap )

			// Swap the chip
			const oldChip = this.swapThingInArray(
				idxToSwap,
				answers.chipAdded,
				navi.CPattacks )

			// And add the old chip to the library
			navi.chipLibrary.push( oldChip )
		}
	}

	swapThingInArray(idx, newThing, list) {
		for (let i = 0; i < list.length; i++) {
			if ( idx == i ) {
				const oldThing = list[i]
				list[i] = newThing
				return oldThing
			}
			else continue
		}
	}

	findIndexOf( array, name ) {
		return array.findIndex( i => i.name == name )
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