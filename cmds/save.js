const NFM = require('../utils/NaviFileManager')

module.exports = async (args) => {
	// Get the navi (and break the program if you don't)
	const json = await getNaviWithName( args._[1] )

	const fileName = naviName.replace( '.EXE', 'DotEXE.json' )

	await NFM.makeJson( json, fileName )
	console.log(`
	Your navi's information was saved succesfully as "${fileName}"!`)

}