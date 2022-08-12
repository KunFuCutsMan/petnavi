// Imports and Stuff
const NFM = require('../utils/NaviFileManager')
const EnemyJson = require('../utils/EnemyList')
const BattleManager = require('../utils/BattleManager')

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

	// While loop of (navi.HP > 0) || enemies.length == 0
	// Show enemies' stats
	// Let player decide action
	// Actions occur
	// Enemies attack
	// Repeat while loop

	// Enumerate and push enemies

	let enemies = []
	for (let i = 0; i < 2; i++) {
		const x = EnemyJson('Mettaur')
		x.name += ''+(i+1)
		enemies.push(x)
	}

	const Bttl = new BattleManager(navi, enemies, true)

	// Main loop
	while ( !Bttl.isBattleOver() ) {
		console.clear()
		console.log( getUI( Bttl ) )
		
		const answerAction = await inquirer.prompt({
			type: 'list',
			name: 'action',
			message: 'What will you do?',
			choices: [
			'Attack', 'Cyber Actions',
			'Defend', new inquirer.Separator() , 'Escape'
			],
			loop: true,
			pageSize: 5
		})

		// Choose a target, if any
		let target = ''
		if (answerAction.action !== 'Defend' && answerAction.action !== 'Escape') {
			const answerTarget = await inquirer.prompt({
				type: 'list',
				name: 'target',
				message: 'Attack Who?',
				choices: Bttl.enemyList,
				loop: true,
			})
			target = answerTarget.target
		}

		// Do actions
		switch (answerAction.action) {
			case 'Attack':
				Bttl.naviAttacks(target)
				Bttl.addToActionQueue(Bttl.navi.name+' attacked '+target+'!')
				break
			case 'Cyber Actions':
				Bttl.addToActionQueue(Bttl.navi.name+' attemted to do an action not yet implemented!')
				break
			case 'Defend':
				Bttl.addToActionQueue(Bttl.navi.name+' attemted to do an action not yet implemented!')
				break
			case 'Escape':
				Bttl.addToActionQueue('Attempted to escape...')
				Bttl.naviEscapes()
				break
		}

		// Log what happened
		for (const str of Bttl.actionQueue) {
			console.log(str)
			await sleep(750)
		}
		// And reset for next turn
		Bttl.clearActionQueue()
	}

	// Check the output of the battle
	if (Bttl.isEscaped)
		console.log('YOU ESCAPED')
	else if (Bttl.navi.HP > 0)
		console.log('YOU WON')
	else if (Bttl.enemyList.length > 0)
		console.log('YOU LOST LOL')

} // end of module

function getEnemyListUI(eList) {
	let str = ''
	for (const e of eList)
		str += '\t'+e.name + '\t\t HP: '+e.HP+' / '+e.maxHP+'\n'
	return str
}

function getShortNaviUI(navi) {
	return `
	${navi.name}		${navi.core}
	HP: ${navi.HP} / ${navi.maxHP}		CP: ${navi.CP} / ${navi.maxCP}`
}

function getUI(Bttl) {
	const enemies = Bttl.enemyList
	const navi = Bttl.navi
	return `
	YOU'RE BATTLING AGAISNT:

${getEnemyListUI(enemies)}
	==================================================
${getShortNaviUI(navi)}`
}