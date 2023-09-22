import minimist from "minimist";
import { NFM } from "../utils/NaviFileManager";
import { NaviName } from "../types";

export default async function save(args: minimist.ParsedArgs) {
	// Get the navi (and break the program if you don't)
	const naviName = args._[1] as NaviName
	const json = await NFM.getNaviFromStorage( naviName )

	if ( !json ) {
		console.error(`
	Navi was not found.`)
		process.exit(1)
	}

	const fileName = naviName.replace( '.EXE', 'DotEXE.json' )

	// And save the boi from extinction
	json.willBeDeleted = false

	await NFM.updateNaviStatsInStorage( json )
	await NFM.makeJson( json, fileName )
	console.log(`
	Your navi's information was saved succesfully as "${fileName}"!`)

}