const attackInfo = require('./AttackInfo')
const getEnemyAttack = require('./EnemyAttacks')
const UI = new ( require('../graphics/BattleUI') )( 80 )

const { Navi, Enemy, EmptySpace, coreTypeClass } = require('../classes')

module.exports = class BattleManager {
	
	// How likely are you able to escape
	escapePercent = 0.2

	constructor( Navi, enemyList, canEscape ) {
		this.navi = Navi
		this.enemyList = this.renameToUniqueEnemies( enemyList )
		this.deadEnemyList = []

		// Setting up for being able to escape
		this.isPossibleToEscape = canEscape
		this.isEscaped = false

		this.actionQueue = []
	}

	// Gets an array of enemy names, returns an array of said enemies
	renameToUniqueEnemies( enemyList ) {
		let list = []
		let enemyCount = {} // Object that will be used to count enemies

		for (const enemy of enemyList) {
			if ( enemy instanceof EmptySpace )
				continue

			// Increase the count of that enemy's occurances
			if (enemyCount[ enemy.name ] == undefined)
				enemyCount[ enemy.name ] = 1
			else enemyCount[ enemy.name ]++

			// Add the number if there's another enemy
			if ( enemyCount[ enemy.name ] > 1 )
				enemy.name += enemyCount[ enemy.name ]

			list.push( enemy )
		}

		return list
	}

	// Loop as seen previously in battle.js
	async mainLoop() {
		while ( !this.isBattleOver() ) {
			
			// Decide what to do
			const acts = await UI.showMenuAndAskActions( this.navi, this.enemyList )

			// Do actions
			switch ( acts.action ) {
				case 'Attack':
					this.addToActionQueue(this.navi.name+' attacked '+acts.target+'!')
					this.naviAttacks(acts.target)
					break
				case 'Cyber Actions':
					this.addToActionQueue(this.navi.name+' used '+acts.cpattk+'!')
					this.naviCyberAttacks(acts.target, acts.cpattk)
					break
				case 'Defend':
					this.addToActionQueue(this.navi.name+' defended agaisnt any attacks')
					this.naviDefends()
					break
				case 'Escape':
					this.addToActionQueue('Attempted to escape...')
					this.naviEscapes()
					break
			}

			// If battle isn't escaped let the enemies attack
			if( !this.isEscaped )
				this.enemiesTurn()

			// Log what happened
			await UI.logActionQueue( this.actionQueue, this.isBattleOver() )

			// And reset for next turn
			this.clearActionQueue()
		}
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
		else if ( this.enemyList.every( e => e instanceof EmptySpace ) )
			return 'WON'
		else {
			console.error('Something strange happened during the battle:',
				this.navi, this.enemyList, this.isEscaped)
			return ''
		}
	}

	// Either if the battle was escaped from, navi has no HP, or enemies are EMPTY_SPACE
	isBattleOver() {
		if ( this.isEscaped ) // Player escaped
			return true
		else if ( this.navi.HP <= 0 ) // Player lost
			return true
		else if ( this.enemyList.every( e => e instanceof EmptySpace ) ) // Player won
			return true
		else return false
	}

	enemyAvoidsAttack( enemy ) {
		if ( enemy.isAvoiding ) {
			if ( enemy.avoidAttack() ) {
				this.addToActionQueue("But "+enemy.name+" avoided the attack!")
				return true
			}
			else return false
		}
		else return false
	}

	// "Attack" action
	naviAttacks(target) {
		const enemy = this.getEspecifiedEnemy(target)

		// check if the target will avoid the attack
		if ( this.enemyAvoidsAttack( enemy ) )
			return
		
		enemy.recieveDamage( 10 )
		
		this.enemyLifeCheck()
	}

	// "Cyber Actions" attack
	naviCyberAttacks(target, cpAttack) {
		const chip = attackInfo(cpAttack)
		const enemy = this.getEspecifiedEnemy(target)

		// check if chip is usable
		if ( !this.navi.reduceCP( chip.cpCost ) ) {
			this.addToActionQueue("But there's not enough Cyber Points to do that!")
			return
		}

		// check chip's target type and do damage to corresponding targets
		switch (chip.target) {
			case 'Single':
				this.doSingleCP(chip, enemy)
				break
			case 'Triple':
				this.doTripleCP(chip, enemy)
				break
			case 'Heal':
				this.doUseHealChip(chip)
				break
		}

		// update stuff
		this.enemyLifeCheck()
	}

	// Attack with a chip of target type 'Single'
	doSingleCP(chip, enemy) {

		// Deal an array of damage to the enemy
		for (const damage of chip.attackValue) {
			if ( this.enemyAvoidsAttack( enemy ) )
				continue

			const dmg = enemy.recieveDamage( damage, new (coreTypeClass( chip.type )) )
			
			this.addToActionQueue(
				this.navi.name+' dealt '+dmg+' damage to '
				+enemy.name+' using '+chip.name+'!')
		}
	}

	// Attack with a chip of target type 'Triple'
	doTripleCP(chip, enemy) {
		const nmeIndex = this.enemyList.indexOf(enemy)
		let j = 0 // Counter for chip.attackValue

		// Go from the enemy before to the next one
		for (let i = nmeIndex-1; i <= nmeIndex+1; i++) {
			// If theres an enemy on this index
			if (this.enemyList[i] && this.enemyList[i] instanceof Enemy) {
				if ( this.enemyAvoidsAttack( enemy ) ) {
					j++
					continue
				}

				const dmg = this.enemyList[i].recieveDamage(
					chip.attackValue[j],
					new (coreTypeClass( chip.type ))
				)

				this.addToActionQueue( this.navi.name +
					' dealt '+ dmg +' damage to ' + this.enemyList[i].name +
					' using '+ chip.name + '!')
			}

			j++
		}
	}

	// Use a 'Heal' target type chip
	doUseHealChip(chip) {
		// Heal the navi
		this.navi.healHP( chip.attackValue[0] )

		if ( this.navi.HP >= this.navi.maxHP )
			this.addToActionQueue(
				this.navi.name+' recovered all their health')
		else 
			this.addToActionQueue(
				this.navi.name+' recovered '+chip.attackValue[0]+ ' HP')
	}

	// "Defend" action
	naviDefends() {
		// See doEnemyAttack() to see what is done with this flag
		this.navi.isDefending = true

		// Recover some CP
		this.navi.healCP( this.navi.defendCPBonus )

		if ( this.navi.CP >= this.navi.maxCP ) {
			this.addToActionQueue(this.navi.name+' recovered all of their CP')
		}
		else {
			this.addToActionQueue(this.navi.name+' recovered some of their CP')
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
		for ( const enemy in this.enemyList )
			if ( enemy instanceof Enemy ) {
				enemy.isDefending = false
				enemy.isAvoiding = false
			}

		// Let each enemy do their action
		for (const enemy of this.enemyList) {

			// ..As long as they're not an EMPTY_SPACE
			if (enemy instanceof EmptySpace)
				continue

			const attk = enemy.chooseAction()
			
			// Switch case in case other common actions are added like fleeing
			switch (attk) {
				case 'Nothing':
					this.addToActionQueue(enemy.name+' did absolutely nothing!')
					break
				case 'Defend':
					this.addToActionQueue(enemy.name+' will defend next turn')
					enemy.isDefending = true
					break;
				case 'Dodge':
					this.addToActionQueue(enemy.name+" will attempt to dodge the next turn's attack")
					enemy.isAvoiding = true
					break 
				default:
					this.doEnemyAttack( attk, enemy )
			}
		}

		// Navi is no longer defending (if they were)
		this.navi.isDefending = false
	}

	// Let that enemy attack
	doEnemyAttack(attk, author) {
		const attack = getEnemyAttack(attk)

		// Do an array of damage
		for (const damage of attack.attackValue) {

			// Check if that especific dmg missed
			const missed = this.calcRandomBool(attack.missChance)

			if (missed) {
				this.addToActionQueue(author.name + "'s " +
					attack.name + ' missed '
					+ this.navi.name + '!')
				continue
			}

			const dmg = this.navi.recieveDamage( damage, new (coreTypeClass( attack.type )) )
			
			this.addToActionQueue(
				author.name+' dealt '+dmg+' damage to '
				+this.navi.name+' using '+attack.name+'!')
		}
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
			if ( e instanceof Enemy && e.HP <= 0) {
				this.addToActionQueue(e.name +' was deleted!')

				// Save the enemy for later use
				this.deadEnemyList.push( e )

				// And remove them from battle
				const index = this.enemyList.indexOf(e)
				this.enemyList.splice(index, 1, new EmptySpace() )
			}
		} )
	}

	// Based on a float value between 0 and 1 return a random boolean
	calcRandomBool(float) {
		const x = Math.random()
		return x <= float
	}

}