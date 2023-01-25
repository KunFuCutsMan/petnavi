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

	addNaviChips(cpattks) {
		this.ui.div(
			{text: 'CHIPS:', align: 'left', padding: [0, 0, 0, 8]},
			{text: ''})

		// Get the navi's CPattacks arranged neatly into 4 cols
		for (let i = 0; i <= cpattks.length; i+=4 ) {
			const chip1 = cpattks[i] ? cpattks[i] : ''
			const chip2 = cpattks[i+1] ? cpattks[i+1] : ''
			const chip3 = cpattks[i+2] ? cpattks[i+2] : ''
			const chip4 = cpattks[i+3] ? cpattks[i+3] : ''

			this.ui.div(
				{text: chip1, align: 'center'},
				{text: chip2, align: 'center'},
				{text: chip3, align: 'center'},
				{text: chip4, align: 'center'} )
		}
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