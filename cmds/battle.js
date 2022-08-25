// Imports and Stuff
const NFM = require('../utils/NaviFileManager')
const EnemyJson = require('../utils/EnemyList')
const BattleManager = require('../utils/BattleManager')
const BattleUI = require('../utils/BattleUI')

const inquirer = require('inquirer')

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

	// Randomly get 3 enemies
	const nmeArray = ['Mettaur', 'Swordy', 'Powie', 'Fishy', 'Spikey', 'Piranha']
	let enemies = []
	for (let i = 0; i < 3; i++) {
		const j = Math.floor( Math.random() * nmeArray.length )
		const x = EnemyJson(nmeArray[j])
		x.name += ''+(i+1)
		enemies.push(x)
	}

	const Bttl = new BattleManager(navi, enemies, true)
	const UI = new BattleUI( Bttl.EMPTY_SPACE )

	// Main loop
	while ( !Bttl.isBattleOver() ) {
		console.clear()

		UI.resetUI()
		console.log( UI.getBattleUI(Bttl.navi, Bttl.enemyList) )
		
		// Decide what to do
		const answerAction = await inquirer.prompt({
			type: 'list',
			name: 'a',
			message: 'What will you do?',
			choices: [
			'Attack', 'Cyber Actions',
			'Defend', new inquirer.Separator() , 'Escape'
			],
			loop: true,
			pageSize: 5
		})

		// If "Cyber Action" then decide what chip to use
		let cpAttack = ''
		let chip = {}
		
		if (answerAction.a === 'Cyber Actions') {
			const answerCPAttk = await inquirer.prompt({
				type: 'list',
				name: 'cpattk',
				message: 'Choose your Chip:',
				choices: Bttl.navi.CPattacks,
				pageSize: 15,
				loop: true,
			})
			cpAttack = answerCPAttk.cpattk

			chip = Bttl.getChipData(cpAttack)
		}

		// Choose a target, if any
		let target = ''

		// chip.canTarget will only work if cyber actions was chosen
		const targetIsRequired = answerAction.a === 'Attack' || chip.canTarget

		if ( targetIsRequired ) {
			const answerTarget = await inquirer.prompt({
				type: 'list',
				name: 'target',
				message: 'Attack Who?',
				choices: Bttl.enemyList.filter( i => i !== Bttl.EMPTY_SPACE),
				loop: false,
			})
			target = answerTarget.target
		}

		// Do actions
		switch (answerAction.a) {
			case 'Attack':
				Bttl.addToActionQueue(Bttl.navi.name+' attacked '+target+'!')
				Bttl.naviAttacks(target)
				break
			case 'Cyber Actions':
				Bttl.addToActionQueue(Bttl.navi.name+' used '+cpAttack+'!')
				Bttl.naviCyberAttacks(target, cpAttack)
				break
			case 'Defend':
				Bttl.addToActionQueue(Bttl.navi.name+' defended agaisnt any attacks')
				Bttl.naviDefends()
				break
			case 'Escape':
				Bttl.addToActionQueue('Attempted to escape...')
				Bttl.naviEscapes()
				break
		}

		// If battle isn't escaped let the enemies attack
		if( !Bttl.isEscaped ) {
			Bttl.enemiesTurn()
		}

		// Log what happened
		for (const str of Bttl.actionQueue) {
			console.log(str)
			await sleep(750)
		}

		// Let the player read what happened
		if ( !Bttl.isBattleOver() )
			await sleep(1500)

		// And reset for next turn
		Bttl.clearActionQueue()
	}

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

