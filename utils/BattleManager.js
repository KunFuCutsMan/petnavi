const getChipData = require('./AttackInfo.js')
const getEnemyAttack = require('./EnemyAttacks.js')

TypeWeaknessJson = {
	'FIRE': ['WATER', 'WIND'],
	'WOOD': ['FIRE', 'SWORD'],
	'ELEC': ['WOOD', 'BREAK'],
	'AQUA': ['ELEC', 'TARGET'],
	'SWORD': ['BREAK', 'ELEC'],
	'WIND': ['SWORD', 'WOOD'],
	'TARGET': ['WIND', 'FIRE'],
	'BREAK': ['TARGET', 'WATER']
}

module.exports = class BattleManager {


	constructor(navi, enemyList, canEscape) {
		this.navi = navi
		this.enemyList = enemyList

		// Setting up for being able to escape
		this.isPossibleToEscape = canEscape
		this.isEscaped = false

		this.isNaviDefending = false
		this.isNMEDefending = {}

		this.enemyList.forEach( e => {
			this.isNMEDefending[e.name] = false
		} )
		
		this.naviDefendBonus = 0.2
		this.enemyDefendBonus = 0.2

		this.actionQueue = []
	}

	//Get the especified enemy
	getEspecifiedEnemy(name) {
		return this.enemyList.find( o => {
			return o.name === name
		} )
	}

	isBattleOver() {
		if ( this.isEscaped ) // Player escaped
			return true
		else if ( this.navi.HP <= 0 ) // Player lost
			return true
		else if ( this.enemyList.length <= 0 ) // Player won
			return true
		else return false
	}

	isItWeakTo( victimCore, weakCore ) {
		let flag = false
		
		if (weakCore !== 'NEUTRAL' && victimCore !== 'NEUTRAL')
			flag = TypeWeaknessJson[victimCore].includes(weakCore)
		
		return flag
	}

	// "Attack" action
	naviAttacks(target) {
		const enemy = this.getEspecifiedEnemy(target)
		
		enemy.HP -= this.calcEnemyDamage(10, 'NEUTRAL', enemy.name, enemy.core)
		
		this.enemyLifeCheck()
	}

	// "Cyber Actions" attack
	naviCyberAttacks(target, cpAttack) {
		const chip = getChipData(cpAttack)

		// check if chip is usable
		const tmpCPafterUse = this.navi.CP - chip.cpCost
		if ( tmpCPafterUse < 0) {
			this.addToActionQueue("But there's not enough Cyber Points to do that!")
			return
		}

		// check chip's target type
		// do damage to corresponding targets
		switch (chip.target) {
			case 'Single':
				this.doSingleCP(chip, target)
				break
			case 'Triple':
				this.doTripleCP(chip, target)
				break
			case 'Heal':
				this.doUseHealChip(chip)
				break
		}

		// update stuff
		this.navi.CP = tmpCPafterUse
		this.enemyLifeCheck()
	}

	doSingleCP(chip, target) {
		const enemy = this.getEspecifiedEnemy(target)

		// Deal an array of damage to the enemy
		for (const damage of chip.attackValue) {
			const dmg = this.calcEnemyDamage(damage, chip.core, enemy.name, enemy.core)
			
			this.addToActionQueue(
				this.navi.name+' dealt '+dmg+' damage to '
				+target+' using '+chip.name+'!')
			
			enemy.HP -= dmg
		}
	}

	doTripleCP(chip, target) {
		const enemy = this.getEspecifiedEnemy(target)
		const nmeIndex = this.enemyList.indexOf(enemy)
		let j = 0 // Counter for chip.attackValue

		// Go from the enemy before to the next one
		for (let i = nmeIndex-1; i <= nmeIndex+1; i++) {
			// If theres an enemy on this index
			if (this.enemyList[i]) {
				const dmg = this.calcEnemyDamage(
				chip.attackValue[j], chip.core,
				this.enemyList[i].name,
				this.enemyList[i].core)

				this.addToActionQueue(
				this.navi.name+' dealt '+dmg+' damage to '
				+this.enemyList[i].name+' using '+chip.name+'!')

				this.enemyList[i].HP -= dmg
			}

			j++
		}

	}

	doUseHealChip(chip) {
		// Heal the navi
		let newHP = this.navi.HP + chip.attackValue[0]

		if (newHP >= this.navi.maxHP) {
			this.addToActionQueue(
				this.navi.name+' recovered all their health')
			newHP = this.navi.maxHP
		}
		else {
			this.addToActionQueue(
				this.navi.name+' recovered '+chip.attackValue[0]+ 'HP')
		}

		this.navi.HP = newHP
	}

	// "Defend" action
	naviDefends() {
		this.isNaviDefending = true
		// See doEnemyAttack() to see
		// What is done with this flag
	}

	// "Escape" action
	naviEscapes() {
		if (!this.isPossibleToEscape) {
			this.addToActionQueue("It's not possible to escape!")
			return
		}

		// Randomly assign if navi was able to escape
		const EscapePercent = 1/5
		this.isEscaped =
			Math.round( Math.random() * EscapePercent * 10 )
			>= Math.floor( EscapePercent * 10 )

		if (!this.isEscaped)
			this.addToActionQueue("...But couldn't!")
	}

	// Enemies' turn
	enemiesTurn() {
		// Reset every "isNMEDefending" value
		for (const e in this.isNMEDefending)
			this.isNMEDefending[e] = false

		// Let each enemy do their action
		for (const enemy of this.enemyList) {
			const attk = this.chooseNMEAttack(enemy)
			
			// Switch case in case other common actions are added like fleeing
			switch (attk) {
				case 'Nothing':
					this.addToActionQueue(enemy.name+' did absolutely nothing!')
					break
				case 'Defend':
					this.addToActionQueue(enemy.name+' will defend next turn')
					this.doEnemyDefend(enemy.name)
					break;
				case 'Dodge':
					this.addToActionQueue(enemy.name+' attempted to dodge the attack!')
					break
				default:
					this.doEnemyAttack(attk, enemy.name)
			}
		}

		// Navi is no longer defending (if they were)
		this.isNaviDefending = false
	}

	chooseNMEAttack(enemy) {
		let action = ''

		// Get action from secuence if there's one active
		if (enemy.secuence.length > 0)
			action = enemy.secuence.shift()

		// Choose action todo (if no secuence)
		if (!action) {
			// Choose an index
			const i = Math.floor( Math.random() * enemy.CPattacks.length )
			
			// If its a secuence then copy it to enemy.secuence and use it
			if ( Array.isArray(enemy.CPattacks[i]) ) {
				enemy.secuence = enemy.CPattacks[i].map( i => i )
				action = enemy.secuence.shift()
			}
			else
				action = enemy.CPattacks[i]
		}

		return action
	}

	doEnemyAttack(attk, author) {
		const attack = getEnemyAttack(attk)

		// Check if attack missed
		const missed =
				Math.round( Math.random() * attack.missChance * 10 )
				>= Math.floor( attack.missChance * 10 )

		if (missed) {
			this.addToActionQueue(author+"'s "+attack.name+' missed '+this.navi.name+'!')
			return
		}

		// Do damage
		for (const damage of attack.attackValue) {
			const dmg = this.calcNaviDamage(damage, attack.type)
			
			this.addToActionQueue(
				author+' dealt '+dmg+' damage to '
				+this.navi.name+' using '+attack.name+'!')
			
			this.navi.HP -= dmg
		}
	}

	doEnemyDefend(name) {
		// Next turn this enemy's damage will be less
		this.isNMEDefending[name] = true
	}

	// Add a string to the turn's queue
	addToActionQueue(str) {
		this.actionQueue.push(str)
	}

	clearActionQueue() {
		this.actionQueue = []
	}

	// this.enemyList is modified to its normal state
	// minus the enemies which have 0 or less hp
	enemyLifeCheck() {
		this.enemyList = this.enemyList.filter( e => {
			if (e.HP <= 0)
				this.addToActionQueue(e.name+' was deleted!')

			return e.HP > 0
		})
	}

	// Calculate the damage done to the navi
	// Including factors like weaknesses and defend actions
	calcNaviDamage(dmg, core) {
		let total = dmg
		
		// Apply weakness value
		if ( this.isItWeakTo( this.navi.core , core ) )
			total *= 2

		// Subtract damage if navi defends
		if ( this.isNaviDefending )
			total = Math.round( total * (1 - this.naviDefendBonus) )

		return total
	}

	calcEnemyDamage(dmg, core, enemyName, enemyCore) {
		let total = dmg
		
		// Apply weakness value
		if ( this.isItWeakTo( enemyCore , core ) )
			total *= 2

		// Subtract damage if navi defends
		if ( this.isNMEDefending[enemyName] )
			total = Math.round( total * (1 - this.enemyDefendBonus) )

		return total
	}

}
