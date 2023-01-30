const UI = require('cliui')

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
		this.ui.div(
			{ text: navi.name , align: 'center' },
			{ text: navi.Core.type , align: 'center' } )

		this.ui.div(
			{ text: 'HP: '+navi.HP+' / '+navi.maxHP , align: 'center' },
			{ text: 'CP: '+navi.CP+' / '+navi.maxCP , align: 'center' } )
	}

	addNaviChips( navi ) {
		const cntCPattks = this.countThingInArray( navi.CPattacks )
		const cntLibrary = this.countThingInArray( navi.chipLibrary )

		this.ui.div(
			{ text:'= FOLDER =', align: 'center' },
			{ text: '= LIBRARY =', align: 'center' })

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