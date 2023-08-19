import minimist from "minimist"

import { NFM } from "../utils/NaviFileManager";
import { NaviName } from "../types";
import { Navi } from "../classes/navi";
import { ChipUI } from "../graphics/ChipUI";

module.exports = async (args: minimist.ParsedArgs) => {
	// Get the navi (and break the program if you don't)
	const naviName = args._[1] as NaviName
	const naviData = await NFM.getNaviFromStorage( naviName )


	if ( !naviData ) {
		console.error(`Could not find a Navi with the name "${naviName}"`)
		process.exit(1)
	}

	const navi = new Navi( naviData )

	// Show the menu
	const UI = new ChipUI(80)
	await UI.showMenu( navi )

	await NFM.updateNaviStatsInStorage( navi.toData() )
	console.log('Changes have been saved')
}