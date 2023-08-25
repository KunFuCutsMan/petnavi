import minimist from "minimist";
import { Enemy } from "../classes/enemy";
import { Navi } from "../classes/navi";
import { BattleManager } from "../utils/BattleManager";
import { NFM } from "../utils/NaviFileManager";
import { NaviName } from "../types";

module.exports = async (args: minimist.ParsedArgs) => {
	// Get the navi (and break the program if you don't)
	const naviData = await NFM.getNaviFromStorage( args._[1] as NaviName )
	const navi = new Navi( naviData )

	// Randomly get 1 - 5 enemy names from the array
	
	const enemies = [ new Enemy('Mettaur'), new Enemy('Dummy'), new Enemy('Mettaur') ]

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
			await NFM.updateNaviStatsInStorage( navi.toData() )
			console.log( res.str )
	}
} // end of module

