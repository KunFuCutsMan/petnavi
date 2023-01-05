const ChipUI = require('../graphics/ChipUI')
const PaginatorUI = require('../graphics/PaginatorUI')
const NFM = require('../utils/NaviFileManager')

const sleep = (ms = 2000) => new Promise( (r) => setTimeout(r, ms) )

module.exports = async (args) => {
	// Get the navi (and break the program if you don't)
	const naviName = args._[1]
	const navi = await NFM.getNaviWithName( args._[1] )


	if ( !navi ) {
		console.error('Could not find a Navi with the name "'+naviName+'"')
		process.exit(1)
	}

	// Show the menu
	const UI = new ChipUI(80)
	await UI.showMenu( navi )

	await NFM.updateNaviStatsInStorage(naviName, navi)
	console.log('Changes have been saved')
}