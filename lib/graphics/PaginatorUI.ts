import Enquirer from "enquirer"
import { ViewerUI } from "./ViewerUI"
import { getChipInfo } from "../utils/chipAttackInfo"
import { getColorFromColorType } from "./colorFromType"

type Answers = {
	[K: string]: any
}

class Paginator<T> {

	readonly content: Array<T> = []
	readonly segmentsOf: number
	readonly pagesTotal: number

	currentPageIndex = 0

	constructor(content: Array<T>, segmentsOf: number) {
		this.content = content
		this.segmentsOf = segmentsOf

		this.pagesTotal = Math.ceil( this.content.length / this.segmentsOf )
	}

	paginate(): Array<T> {
		const initialIndex = this.currentPageIndex * this.segmentsOf
		const offset = initialIndex + this.segmentsOf
		return this.content.slice( initialIndex, offset )
	}

	previousPage() {
		if( this.currentPageIndex > 0 )
			this.currentPageIndex--
	}

	nextPage() {
		if ( this.currentPageIndex < this.pagesTotal - 1 )
			this.currentPageIndex++
	}
}

export class PaginatorUI extends ViewerUI {

	enq: Enquirer
	list: Paginator<string>

	constructor(w: number, list: Array<string>) {
		super(w)

		this.enq = new Enquirer()
		
		this.list = new Paginator<string>( list, 10 )
	}

	async showPaginatorMenu() {
		this.resetScreen()
		
		const answers: Answers = await this.enq.prompt({
			type: 'select',
			name: 'action',
			message: `${this.getPaginatorList()}\nShow:`,
			choices: ['Previous Page', 'Next Page' , 'Back']
		})
		
		// Move the page accordingly
		if ( answers.action === 'Previous Page' )
			this.list.previousPage()
		
			if ( answers.action === 'Next Page' )
			this.list.nextPage()

		// And as long as we don't wish to to the previous menu,
		// show the paginator again
		if ( answers.action !== 'Back' )
			await this.showPaginatorMenu()
	}

	private addPagesNumbers() {
		this.ui.div({
			text: `PAGE: ${this.list.currentPageIndex + 1} / ${this.list.pagesTotal}`,
			padding: [0,0,0,0], align: 'center'})
	}

	private addChipsListedInPage() {
		this.ui.div(
			{text: '#', padding: [0,0,0,0], align: 'center'},
			{text: 'Type:', padding: [0,0,0,0], align: 'center'},
			{text: 'Chip:', padding: [0,0,0,0], align: 'center'},
			{text: 'Target:', padding: [0,0,0,0], align: 'center'},
			{text: 'Damage:', align: 'left', padding: [0, 0, 0, 4] },
		)

		const content = this.list.paginate()

		content.forEach( (v, i) => {
			const chip = getChipInfo(v)
			const c = getColorFromColorType( chip.type )

			this.ui.div(
				{text: `${i + 1}`, padding: [0,0,0,0], align: 'center'},
				{text: c( chip.type ), padding: [0,0,0,0], align: 'left' },
				{text: c( chip.name ), padding: [0,0,0,0], align: 'left'},
				{text: c( chip.target ), padding: [0,0,0,0], align: 'left'},
				{text: c( chip.attackValue.map( n => `${n}`).reduce( (acc, val) => `${acc} ${val}` ) ),
					align: 'center', padding: [0, 4, 0, 0] },
			)
		})

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