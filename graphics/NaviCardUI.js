
const ViewerUI = require('./ViewerUI')

module.exports = class ChipUI extends ViewerUI {

	addZenny(z) {
		this.ui.div(
			{text: 'ZENNY: ' + z, align: 'left', padding: [0, 0, 0, 8]},
			{text: ''}
		)
	}

	strColumnChips( chipCount ) {
		let str = ''

		for (const chip in chipCount)
			str += chip + ' x' + chipCount[chip] + '\n'
		
		return str
	}

	getFullNaviCard(navi) {
		this.addBar()
		this.addVoid()
		this.addNaviStats(navi)
		this.addVoid()
		this.addZenny(navi.zenny)
		this.addVoid()
		this.addNaviChips( navi )
		this.addBar()

		return this.getUIstring()
	}
	
}