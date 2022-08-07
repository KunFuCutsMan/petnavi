// Imports and Stuff
const NFM = require('../utils/NaviFileManager')
const logUpdate = require('log-update')
const EnemyJson = require('../utils/EnemyList')
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

	// Load battles (enemies listed in array)

	// While loop of (navi.HP > 0) || enemies.length == 0
	// Show enemies' stats
	// Let player decide action
	// Actions occur
	// Enemies attack
	// Repeat while loop

	// May require a BattleHandler

	let enemies = []

	// Enumerate and push enemies
	for (let i = 0; i < 2; i++) {
		const x = Object.create(EnemyJson['Mettaur'])
		x.name += ''+(i+1)
		enemies.push(x)
	}
	
	// Main loop
	while (navi.HP > 0 && enemies.length > 0) {
		logUpdate( getUI(enemies, navi) )

		// Escape from the loop ASAP I only want testing
		navi.HP -= 50
		
		const answerCore = await inquirer.prompt({
			type: 'list',
			name: 'action',
			message: 'What will you do?',
			choices: [
			'Attack', 'Cyber Actions',
			'Defend', new inquirer.Separator() , 'Escape'
			],
			loop: false,
			pageSize: 5
		})

		let target = ''

		if (answerCore.action !== 'Defend' && answerCore.action !== 'Escape') {
			const answerTarget = await inquirer.prompt({
				type: 'list',
				name: 'target',
				message: 'Attack Who?',
				choices: enemies,
				loop: true,
			})
			target = answerTarget.target
		}
	}

	// Check who won
	if (navi.HP > 0)
		console.log('YOU WON')
	else if (enemies.length > 0)
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

function getUI(enemies, navi) {
	return `
	YOU'RE BATTLING AGAISNT:

${getEnemyListUI(enemies)}
	==================================================
${getShortNaviUI(navi)}`
}