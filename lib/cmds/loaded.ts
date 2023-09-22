import minimist from "minimist"

import { NFM } from "../utils/NaviFileManager";
import { NaviCardUI } from "../graphics/NaviCardUI";
import { Navi } from "../classes/navi";

export default async function loaded(args: minimist.ParsedArgs) {
	const loadedNavis = await NFM.getAllLoadedNavis()
	const UI = new NaviCardUI(80)

	for (const naviData of loadedNavis) {
		console.log( UI.getFullNaviCard( new Navi( naviData ) ) )
		UI.resetUI()
	}
}