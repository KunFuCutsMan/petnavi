// Imports and other stuff used
const NFM = require('../utils/NaviFileManager')

// Module
module.exports = async (args) => {
	// Get the file's name
	const fileName = args._[1]
		? args._[1]
		: ''

	const json = await NFM.readJson(fileName)
	
	if ( !NFM.isNaviJson(json) ) {
		console.error('File is not a navi json')
		process.exit(1)
	}

	await NFM.loadNaviIntoStorage(json)
	console.log(`
	Navi Loaded!
	Be sure to interact with your navi's name, "${json.name}"!`)
}