const Enquirer = require('enquirer')
const Paginator = require('paginator')

const attackInfo = require('../utils/AttackInfo')
const ViewerUI = require('./ViewerUI')

module.exports = class PaginatorUI extends ViewerUI {

	constructor(w, list) {
		super(w)

		this.enq = new Enquirer()
		this.enq.register( 'selectAfterText', require('./enquirer/SelectAfterText') )
		
		this.paginator = new Paginator(10, 5)
		
		this.list = list
		this.currentPage = 1
	}

	async showPaginatorMenu() {
		this.resetScreen()
		
		let { action } = await this.enq.prompt({
			type: 'selectaftertext',
			name: 'action',
			message: 'Show:',
			textToShow: this.getPaginatorList(),
			choices: ['Previous Page', 'Next Page', 'Back']
		})

		const pag_info = this.paginator.build( this.list.length, this.currentPage )
		
		// Move the page accordingly
		if ( action === 'Previous Page' ) {
			if ( pag_info.has_previous_page ) this.currentPage--
		}
		else if ( action === 'Next Page' ) {
			if ( pag_info.has_next_page ) this.currentPage++
		}

		// And as long as we don't wish to to the previous menu,
		// show the paginator again
		if ( action !== 'Back' )
			await this.showPaginatorMenu()
	}

	addPagesNumbers() {
		const pag_info = this.paginator.build( this.list.length, this.currentPage )
		
		this.ui.div({
			text: 'PAGE ' + pag_info.current_page + ' / ' + pag_info.total_pages,
			align: 'center'})
	}

	addChipsListedInPage() {
		const pag_info = this.paginator.build( this.list.length, this.currentPage )

		this.ui.div(
			{text: '#', align: 'center'},
			{text: 'Type:', align: 'center'},
			{text: 'Chip:', align: 'center'},
			{text: 'Target:', align: 'center'},
			{text: 'Damage:', align: 'left', padding: [0, 0, 0, 4] }
		)
		
		for (let i = pag_info.first_result; i <= pag_info.last_result; i++) {
			const chip = attackInfo( this.list[i] )
			this.ui.div(
				{text: (i+1), align: 'center'},
				{text: chip.type, align: 'left' },
				{text: chip.name, align: 'left'},
				{text: chip.target, align: 'left'},
				{text: chip.attackValue.reduce( (c, i) => c += ' ' + i ),
					align: 'center', padding: [0, 4, 0, 0] },
			)
		}

	}

	getPaginatorList() {
		this.addBar()
		this.addVoid()
		this.addPagesNumbers()
		this.addVoid()
		this.addChipsListedInPage()
		this.addVoid()
		this.addBar()

		return this.getUIstring()
	}
}