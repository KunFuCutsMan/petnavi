import UI from "cliui";
import { getColorFromColorType } from "./colorFromType";
import { Navi } from "../classes/navi";

type CountOfStrings = Record<string, number>

/**
 * ViewerUI will be parent class of all other UI classes
 * 
 * */
export class ViewerUI {

	readonly width: number
	readonly ui: ReturnType< typeof UI >

	constructor(width: number) {
		this.width = width
		this.ui = UI({ width: this.width })
	}

	addNaviStats( navi: Navi ) {
		const color = getColorFromColorType( navi.core.coreType )

		this.ui.div(
			{ text: color(navi.name), padding: [0,0,0,0], align: 'center' },
			{ text: color(navi.core.coreType), padding: [0,0,0,0], align: 'center' },
		)

		this.ui.div(
			{ text: `HP: ${navi.HP} / ${navi.maxHP}`, padding: [0,0,0,0], align: 'center' },
			{ text: `CP: ${navi.CP} / ${navi.maxCP}`, padding: [0,0,0,0], align: 'center' },
		)
	}

	addNaviChips( navi: Navi ) {
		const cntCPattks = this.countThingInArray( navi.attacksCP )
		const cntLibrary = this.countThingInArray( navi.chipLibrary )

		const color = getColorFromColorType( navi.core.coreType )

		this.ui.div(
			{ text: color('= FOLDER ='), padding: [0,0,0,0], align: 'center' },
			{ text: color('= LIBRARY ='), padding: [0,0,0,0], align: 'center' })

		this.ui.div(
			{text: this.strColumnChips(cntCPattks), padding: [0,0,0,8], align: 'left',},
			{text: this.strColumnChips(cntLibrary), padding: [0,0,0,0], align: 'left'})
	}

	countThingInArray( array: Array<string> ): CountOfStrings {
		const countObj: CountOfStrings = {}

		for (const thing of array) {
			if ( countObj[thing] === undefined )
				countObj[thing] = 1
			else countObj[thing]++
		}

		return countObj
	}

	strColumnChips( chipCount: CountOfStrings ): string {
		let str = ''

		for (const chip in chipCount)
			str += `${chip} ${chipCount[chip]}\n`
		
		return str
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