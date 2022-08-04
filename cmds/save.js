const NFM = require('../utils/NaviFileManager')

module.exports = async (args) => {
	// Get the navi's name for a key
	const naviName = args._[1]
	? args._[1]
	: ''

	const json = await NFM.saveNaviFromStorage(naviName)

	if ( !json ) {
		console.error('Could not find a Navi with the name "'+naviName+'"')
		process.exit(1)
	}

	const fileName = naviName.replace( '.EXE', 'DotEXE.json' )

	await NFM.makeJson( json, fileName )
	console.log(`
	Your navi's information was saved succesfully as "${fileName}"!`)

}