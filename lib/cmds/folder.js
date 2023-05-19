const ChipUI = require('../graphics/ChipUI')
const NFM = require('../utils/NaviFileManager')
const { Navi } = require('../classes')

const sleep = (ms = 2000) => new Promise( (r) => setTimeout(r, ms) )

module.exports = async (args) => {
	// Get the navi (and break the program if you don't)
	const naviName = args._[1]
	const naviData = await NFM.getNaviWithName( args._[1] )


	if ( !naviData ) {
		console.error('Could not find a Navi with the name "'+naviName+'"')
		process.exit(1)
	}

	const navi = new Navi( naviData )

	// Show the menu
	const UI = new ChipUI(80)
	await UI.showMenu( navi )

	await NFM.updateNaviStatsInStorage( naviName , navi.toData() )
	console.log('Changes have been saved')
}