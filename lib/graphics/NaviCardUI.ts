import { Navi } from "../classes/navi";
import { ViewerUI } from "./ViewerUI";

export class NaviCardUI extends ViewerUI {

	addZenny( z: number ) {
		this.ui.div(
			{text: 'ZENNY: ' + z, align: 'left', padding: [0, 0, 0, 8]},
			{text: '', padding: [0,0,0,0]}
		)
	}

	getFullNaviCard(navi: Navi) {
		this.addBar()
		this.addVoid()
		this.addNaviStats(navi)
		this.addVoid()
		this.addZenny(navi.zenny)
		this.addVoid()
		this.addNaviChips(navi)
		this.addBar()

		return this.getUIstring()
	}
	
}