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

	// Indicator to show an empty space
	EMPTY_SPACE = '[\t]'

	// Chance for the enemy to avoid the attack
	enemyAvoidBonus = 0.4
	
	// How likely are you able to escape
	escapePercent = 0.2
	
	// How much will everyone defend from an attack
	naviDefendBonus = 0.2
	enemyDefendBonus = 0.2

	constructor(navi, enemyList, canEscape) {
		this.navi = navi
		this.enemyList = enemyList

		// Setting up for being able to escape
		this.isPossibleToEscape = canEscape
		this.isEscaped = false

		// Defend flags
		this.isNaviDefending = false
		this.isNMEDefending = {}

		this.enemyList.forEach( e => {
			this.isNMEDefending[e.name] = false
		} )

		// Avoid flags
		this.isNMEAvoiding = {}
		this.enemyList.forEach( e => {
			this.isNMEAvoiding[e.name] = false
		} )


		// Navis can recover 20% of their CP
		this.CPrecoveryBonus = Math.ceil(this.navi.maxCP / 5)

		this.actionQueue = []
	}

	//Get the especified enemy
	getEspecifiedEnemy(name) {
		return this.enemyList.find( o => {
			return o.name === name
		} )
	}

	// Get the outcome of the battle
	getOutcomeOfBattle() {
		if (this.isEscaped)
			return 'ESCAPED'
		else if (this.navi.HP <= 0)
			return 'LOST'
		else if (this.enemyList.every( e => e === this.EMPTY_SPACE ))
			return 'WON'
	}

	isBattleOver() {
		if ( this.isEscaped ) // Player escaped
			return true
		else if ( this.navi.HP <= 0 ) // Player lost
			return true
		else if ( this.enemyList.every( e => e === this.EMPTY_SPACE) ) // Player won
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

		// check if the target will avoid the attack
		if (this.isNMEAvoiding[target]) {
			const missed = this.calcRandomBool(this.enemyAvoidBonus)

			if (missed) {
				this.addToActionQueue("But "+target+" avoided the attack!")
				return
			}
		}
		
		enemy.HP -= this.calcEnemyDamage(10, 'NEUTRAL', enemy.name, enemy.core)

		// Reset avoids
		for (let e in this.isNMEAvoiding)
			e = false
		
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

		// check if the target will avoid the attack
		if (this.isNMEAvoiding[target]) {
			const missed = this.calcRandomBool(this.enemyAvoidBonus)

			if (missed) {
				this.addToActionQueue("But "+target+" avoided the attack!")
				return
			}
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

		// Reset avoids
		for (let e in this.isNMEAvoiding)
			e = false

		// update stuff
		this.navi.CP = tmpCPafterUse
		this.enemyLifeCheck()
	}

	doSingleCP(chip, target) {
		const enemy = this.getEspecifiedEnemy(target)

		// Deal an array of damage to the enemy
		for (const damage of chip.attackValue) {
			const dmg = this.calcEnemyDamage(damage, chip.type, enemy.name, enemy.core)
			
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
			if (this.enemyList[i] && this.enemyList[i] !== this.EMPTY_SPACE) {
				const dmg = this.calcEnemyDamage(
				chip.attackValue[j], chip.type,
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
				this.navi.name+' recovered '+chip.attackValue[0]+ ' HP')
		}

		this.navi.HP = newHP
	}

	// "Defend" action
	naviDefends() {
		// See doEnemyAttack() to see what is done with this flag
		this.isNaviDefending = true

		// Recover some CP
		const newCP = this.navi.CP + this.CPrecoveryBonus

		if (newCP >= this.navi.maxCP) {
			this.addToActionQueue(this.navi.name+' recovered all of their CP')
			this.navi.CP = this.navi.maxCP
		}
		else {
			this.addToActionQueue(this.navi.name+' recovered some of their CP')
			this.navi.CP = newCP
		}
	}

	// "Escape" action
	naviEscapes() {
		if (!this.isPossibleToEscape) {
			this.addToActionQueue("It's not possible to escape!")
			return
		}

		// Randomly assign if navi was able to escape
		this.isEscaped = this.calcRandomBool(this.escapePercent)
		
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

			// ..As long as they're not an EMPTY_SPACE
			if (enemy === this.EMPTY_SPACE)
				continue

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
					this.addToActionQueue(enemy.name+" will attempt to dodge the next turn's attack")
					this.doEnemyDodge(enemy.name)
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
		const missed = this.calcRandomBool(attack.missChance)

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

	doEnemyDodge(name) {
		// Next turn this enemy may avoid the attack
		this.isNMEAvoiding[name] = true
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
		this.enemyList.forEach( e => {
			if (e.HP <= 0) {
				this.addToActionQueue(e.name +' was deleted!')
				const index = this.enemyList.findIndex(i => i.name === e.name)

				this.enemyList.splice(index, 1, this.EMPTY_SPACE)
			}
		} )
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

	// Based on a float value between 0 and 1 return a random boolean
	calcRandomBool(float) {
		return Math.round( Math.random() * float * 10 )
				>= Math.floor( float * 10 )
	}

}
