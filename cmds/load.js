// Imports and other stuff used
const NFM = require('../utils/NaviFileManager')

// Module
module.exports = async (args) => {
	// Get the navi (and break the program if you don't)
	const json = await getNaviWithName( args._[1] )
	
	if ( !NFM.isNaviJson(json) ) {
		console.error('File is not a navi json')
		process.exit(1)
	}

	await NFM.loadNaviIntoStorage(json)
	console.log(`
	Navi Loaded!
	Be sure to interact with your navi's name, "${json.name}"!`)
}