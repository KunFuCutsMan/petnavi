const UI = require('cliui')
const colorFromType = require('./colorFromType')

/**
 * ViewerUI will be parent class of all other UI classes
 * 
 * */
module.exports = class ViewerUI {

	constructor(w) {
		this.width = w
		this.ui = UI({ width: this.width })
	}

	addNaviStats(navi) {
		const color = colorFromType( navi.Core.type )

		this.ui.div(
			{ text: color( navi.name ) , align: 'center' },
			{ text: color( navi.Core.type ) , align: 'center' } )

		this.ui.div(
			{ text: 'HP: '+navi.HP+' / '+navi.maxHP , align: 'center' },
			{ text: 'CP: '+navi.CP+' / '+navi.maxCP , align: 'center' } )
	}

	addNaviChips( navi ) {
		const cntCPattks = this.countThingInArray( navi.CPattacks )
		const cntLibrary = this.countThingInArray( navi.chipLibrary )

		const color = colorFromType( navi.Core.type )

		this.ui.div(
			{ text: color('= FOLDER ='), align: 'center' },
			{ text: color('= LIBRARY ='), align: 'center' })

		this.ui.div(
			{text: this.strColumnChips( cntCPattks ), align: 'left', padding: [0, 0, 0, 8]},
			{text: this.strColumnChips( cntLibrary ), align: 'left'})
	}

	countThingInArray( array ) {
		const countObj = {}

		for (const thing of array) {
			if ( countObj[thing] === undefined )
				countObj[thing] = 1
			else countObj[thing]++
		}

		return countObj
	}

	addVoid() {
		this.ui.div('')
	}

	addBar() {
		let str = ''
		for (let i = 0; i < this.width; i++)
			str += '='

		this.ui.div({text: str, padding: [0, 0, 0, 0]})
	}

	getUIstring() {
		return this.ui.toString()
	}

	resetUI() {
		this.ui.resetOutput()
	}

	resetScreen() {
		this.resetUI()
		console.clear()
	}
}