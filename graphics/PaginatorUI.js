const inquirer = require('inquirer')
const Paginator = require('paginator')

const attackInfo = require('../AttackInfo')
const ViewerUI = require('./ViewerUI')

module.exports = class PaginatorUI extends ViewerUI {

	constructor(w, list) {
		super(w)
		this.list = list
		this.paginator = new Paginator(10, 5)
		this.currentPage = 1
	}

	async askPageMovements() {
		const a = await inquirer.prompt({
			type: 'list',
			name: 'page',
			message: ' ',
			choices: ['Previous Page', 'Next Page', 'Back'],
			loop: false
		})

		return a
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