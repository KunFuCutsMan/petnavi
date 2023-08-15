import minimist from "minimist"
import { NFM } from "../utils/NaviFileManager";
import { isNaviFile } from "../types";

// Module
module.exports = async (args: minimist.ParsedArgs) => {
	// Get the file's name
	const fileName = args._[1] ? args._[1] : ''

	// And get it's file
	const json = await NFM.readJson( fileName )
	if ( !isNaviFile( json ) ) {
		console.error('File is not a navi json')
		process.exit(1)
	}

	await NFM.loadNaviIntoStorage(json)
	console.log(`
	Navi Loaded!
	Be sure to interact with your navi's name, "${json.name}"!`)
}