// Imports and Stuff
const NFM = require('../utils/NaviFileManager')
const EnemyJson = require('../utils/EnemyList')
const BattleManager = require('../utils/BattleManager')
const BattleUI = require('../utils/BattleUI')

const sleep = (ms = 2000) => new Promise( (r) => setTimeout(r, ms) )

module.exports = async (args) => {
	// Get the navi's name for a key
	const naviName = args._[1]
	? args._[1]
	: ''

	const navi = await NFM.getNaviFromStorage(naviName)
	if ( !navi ) {
		console.error('Could not find a Navi with the name "'+naviName+'"')
		process.exit(1)
	}

	// Randomly get 1 - 5 enemy names from the array
	const nmeArray = ['Mettaur', 'Swordy', 'Powie', 'Fishy', 'Spikey', 'Piranha']
	
	let enemies = []
	for (let i = 0; i < Math.ceil( Math.random() * 5 ); i++) {
		const j = Math.floor( Math.random() * nmeArray.length )
		enemies.push(nmeArray[j])
	}

	const Bttl = new BattleManager(navi, enemies, true)

	// Main loop
	await Bttl.mainLoop()

	// Check the output of the battle
	switch ( Bttl.getOutcomeOfBattle() ) {
		case 'ESCAPED':
			console.log("You've succesfully escaped the battle")
			break
		case 'WON':
			console.log("You've won!")
			break
		case 'LOST':
			console.log("You lost lol")
			break
	}

} // end of module

