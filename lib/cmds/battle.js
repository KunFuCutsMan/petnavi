// Imports and Stuff
const NFM = require('../utils/NaviFileManager')
const EnemyJson = require('../utils/EnemyList')
const BattleManager = require('../utils/BattleManager')

const { Navi, Enemy, EmptySpace, coreTypeClass } = require('../classes')

const sleep = (ms = 2000) => new Promise( (r) => setTimeout(r, ms) )

module.exports = async (args) => {
	// Get the navi (and break the program if you don't)
	const naviData = await NFM.getNaviWithName( args._[1] )
	const navi = new Navi( naviData )

	// Randomly get 1 - 5 enemy names from the array
	const nmeArray = ['EMPTY_SPACE', 'Mettaur', 'Swordy', 'Powie', 'Fishy', 'Spikey', 'Piranha']
	
	let enemies = [ new Enemy('Mettaur'), new Enemy('Dummy'), new Enemy('Mettaur') ]

	const Bttl = new BattleManager(navi, enemies, true)

	// Main loop
	await Bttl.mainLoop()
	navi.healStatsFully()
	
	// Check the output of the battle
	const res = Bttl.calcResultsOfBattle()
	switch ( res.res ) {
		
		case 'DELETION_NOW':
			await NFM.deleteNaviWithFile(navi.name)
			console.log('Your navi got deleted.')
			break
		default:
			await NFM.updateNaviStatsInStorage(navi.name, navi.toData() )
			console.log( res.str )
	}
} // end of module

