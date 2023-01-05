
const ViewerUI = require('./ViewerUI')

module.exports = class ChipUI extends ViewerUI {

	constructor(w) {
		super(w)
	}

	addZenny(z) {
		this.ui.div(
			{text: 'ZENNY: ' + z, align: 'left', padding: [0, 0, 0, 8]},
			{text: ''}
		)
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

	getFullNaviCard(navi) {
		this.addBar()
		this.addVoid()
		this.addNaviStats(navi)
		this.addVoid()
		this.addNaviChips(navi.CPattacks)
		this.addVoid()
		this.addZenny(navi.zenny)
		this.addVoid()
		this.addNaviChipLibrary(navi.chipLibrary)
		this.addVoid()
		this.addBar()

		return this.getUIstring()
	}
	
}