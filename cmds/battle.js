// Imports and Stuff
const NFM = require('../utils/NaviFileManager')
const EnemyJson = require('../utils/EnemyList')
const BattleManager = require('../utils/BattleManager')

const { Navi, Enemy, EmptySpace, coreTypeClass } = require('../classes')

const sleep = (ms = 2000) => new Promise( (r) => setTimeout(r, ms) )

module.exports = async (args) => {
	// Get the navi (and break the program if you don't)
	const naviData = await NFM.getNaviWithName( args._[1] )
	const navi = new NaviClass( naviData )

	// Randomly get 1 - 5 enemy names from the array
	const nmeArray = ['EMPTY_SPACE', 'Mettaur', 'Swordy', 'Powie', 'Fishy', 'Spikey', 'Piranha']
	
	let enemies = [ new Enemy('Mettaur'), new Enemy('Swordy'), new Enemy('Mettaur') ]

	const Bttl = new BattleManager(navi, enemies, true)

	// Main loop
	await Bttl.mainLoop()

	// Who won?
	const bttlOutcome = Bttl.getOutcomeOfBattle()

	// Heal the navi
	navi.healStatsFully()

	// Check the output of the battle
	switch ( bttlOutcome ) {
		case 'ESCAPED':
			console.log("You've succesfully escaped the battle")
			break
		case 'WON':
			console.log("You've won!")

			// Decide if the navi won a chip or a zenny
			if ( Math.random() > 0.5 ) {
				// Drop a chip
				let chipsAvailable = [];
				
				for (const enemy of Bttl.deadEnemyList) {
					chipsAvailable = chipsAvailable.concat( enemy.drops )
				}

				const j = Math.floor( Math.random() * chipsAvailable.length )
				const chipChosen = chipsAvailable[ j ]

				console.log('You got: ' + chipChosen )

				navi.chipLibrary.push( chipChosen )
			}
			else {
				// Gain some zenny
				zennies = 0
				for (const enemy of Bttl.deadEnemyList) {
					zennies += enemy.maxHP
				}

				zennies *= 5

				console.log('You got: ' + zennies + ' zenny')

				navi.zenny += zennies
			}

			await NFM.updateNaviStatsInStorage(navi.name, naviData)

			break
		case 'LOST':

			// Activate may be able to lose
			if (navi.willBeDeleted) {
				await NFM.deleteNaviWithFile(navi.name)
				console.log('Your navi got deleted.')
			}
			else {
				navi.willBeDeleted = true
				await NFM.updateNaviStatsInStorage(navi.name, navi)
				console.warn('Your navi is heading for deletion!')
			}
			break
	}
} // end of module

