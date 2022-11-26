const inquirer = require('inquirer')

const ChipUI = require('../utils/UI/ChipUI')
const NFM = require('../utils/NaviFileManager')

const sleep = (ms = 2000) => new Promise( (r) => setTimeout(r, ms) )

module.exports = async (args) => {
	const UI = new ChipUI(80)
	
	// Get the navi's name for a key
	const naviName = args._[1]
	? args._[1]
	: ''

	const navi = await NFM.saveNaviFromStorage(naviName)


	if ( !navi ) {
		console.error('Could not find a Navi with the name "'+naviName+'"')
		process.exit(1)
	}

	console.log( UI.getCPattackList(navi.CPattacks) )
	UI.resetUI()

	let act = ''

	while (act !== 'Exit') {
		act = await UI.askActionPrompt()

		switch ( act ) {
			case 'Change Folder':
				console.log('folder was changed')
				break
		}
	}
}