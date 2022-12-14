// Imports and Stuff
const NFM = require('../utils/NaviFileManager')
const EnemyJson = require('../utils/EnemyList')
const BattleManager = require('../utils/BattleManager')

const sleep = (ms = 2000) => new Promise( (r) => setTimeout(r, ms) )

module.exports = async (args) => {
	// Get the navi (and break the program if you don't)
	const navi = await getNaviWithName( args._[1] )

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

	// Who won?
	const bttlOutcome = Bttl.getOutcomeOfBattle()

	// Heal the navi
	Bttl.navi.HP = Bttl.navi.maxHP
	Bttl.navi.CP = Bttl.navi.maxCP

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
				
				for (const name of enemies) {
					const nme = EnemyJson(name)
					chipsAvailable = chipsAvailable.concat(nme.drops)
				}

				const j = Math.floor( Math.random() * chipsAvailable.length )
				const chipChosen = chipsAvailable[ j ]

				console.log('You got: ' + chipChosen )

				navi.chipLibrary.push( chipChosen )
			}
			else {
				// Gain some zenny
				zennies = 0
				for (const name of enemies) {
					const nme = EnemyJson(name)
					zennies += nme.maxHP
				}

				zennies *= 5

				console.log('You got: ' + zennies + ' zenny')

				navi.zenny += zennies
			}

			await NFM.updateNaviStatsInStorage(navi.name, navi)

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

