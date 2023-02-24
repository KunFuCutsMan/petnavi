const attackInfo = require('./AttackInfo')
const getEnemyAttack = require('./EnemyAttacks')
const { BattleUI, Logger } = require('../graphics')
const UI = new BattleUI()
const BattleLog = new Logger()

const { Navi, Enemy, EmptySpace, coreTypeClass, Subject } = require('../classes')

module.exports = class BattleManager extends Subject {
	
	// How likely are you able to escape
	escapePercent = 0.2

	constructor( Navi, enemyList, canEscape ) {
		super()
		this.attach( BattleLog )

		this.navi = Navi
		this.enemyList = this.renameToUniqueEnemies( enemyList )
		this.deadEnemyList = []

		// Setting up for being able to escape
		this.isPossibleToEscape = canEscape
		this.isEscaped = false
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
					this.naviAttacks(acts.target)
					break
				case 'Cyber Actions':
					this.naviCyberAttacks(acts.target, acts.cpattk)
					break
				case 'Defend':
					this.naviDefends()
					break
				case 'Escape':
					this.naviEscapes()
					break
			}

			this.enemyStatusCheck()
			this.enemyLifeCheck()

			// If battle isn't escaped let the enemies attack
			if( !this.isEscaped ) {
				this.enemiesTurn()
			}

			this.navi.updateStatuses()

			// Log what happened
			await BattleLog.logActionQueue()
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
		const isEscaped = this.isEscaped
		const isNaviDead = this.navi.HP <= 0
		const areEnemiesDead = this.enemyList.every( e => e instanceof EmptySpace )
		return isEscaped || isNaviDead || areEnemiesDead
	}

	enemyAvoidsAttack( enemy ) {
		if ( enemy.avoidAttack() ) {
			this.notify({
				state: 'ATTACK_AVOIDED',
				subject: enemy.name
			})
			return true
		}
			else return false
	}

	// "Attack" action
	naviAttacks(target) {
		const enemy = this.getEspecifiedEnemy(target)

		this.notify({
			state: 'ATTACK',
			subject: this.navi.name,
			target: enemy.name
		})

		// check if the target will avoid the attack
		if ( this.enemyAvoidsAttack( enemy ) ) {
			this.notify({
				state: 'ATTACK_AVOIDED',
				subject: enemy.name
			})

			return
		}

		this.notify({
			state: 'ATTACK_SUCCESS',
			subject: enemy.name
		})
		
		enemy.recieveDamage( 10 )
	}

	// "Cyber Actions" attack
	naviCyberAttacks(target, cpAttack) {
		const chip = attackInfo(cpAttack)
		const enemy = this.getEspecifiedEnemy(target)

		this.notify({ // SUBJECT used CHIP
			state: 'CYBER_ATTK_USE',
			subject: this.navi.name,
			chip: chip.name
		})

		// check if chip is usable
		if ( !this.navi.reduceCP( chip.cpCost ) ) {
			this.notify({ // Not enough CP
				state: 'CP_LACKING'
			})
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
			default:
				this.notify({
					state: 'NOT_IMPLEMENTED'
				})
		}
	}

	giveStatusTo( enemy, Core = 'NEUTRAL' ) {
		let status = ''

		if ( Core === 'NEUTRAL' || Core.type === 'NEUTRAL' )
			return

		// Get a status effect
		if ( Core.type === 'FIRE' )
			status = 'BURNED'
		else if ( Core.type === 'ELEC' )
			status = 'STUNNED'

		if ( status !== '' ) {
			enemy.getsStatus( status )
			this.notify({
				state: 'STATUS_GIVEN',
				subject: enemy.name,
				status: status
			})
		}

	}

	// Attack with a chip of target type 'Single'
	doSingleCP(chip, enemy) {

		// Deal an array of damage to the enemy
		for (const damage of chip.attackValue) {
			if ( this.enemyAvoidsAttack( enemy ) ) {
				this.notify({
					state: 'ATTACK_AVOIDED',
					subject: enemy.name
				})

				continue
			}

			const dmg = enemy.recieveDamage( damage, new (coreTypeClass( chip.type )) )
			
			this.notify({ // SUBJECT used CHIP on TARGET
				state: 'CYBER_ATTK_SUCCESS',
				subject: this.navi.name,
				target: enemy.name,
				chip: chip.name,
				damage: dmg
			})

		}

		this.giveStatusTo( enemy, new (coreTypeClass( chip.type )) )
	}

	// Attack with a chip of target type 'Triple'
	doTripleCP(chip, enemy) {
		const nmeIndex = this.enemyList.indexOf(enemy)
		let j = 0 // Counter for chip.attackValue

		// Go from the enemy before to the next one
		for (let i = nmeIndex-1; i <= nmeIndex+1; i++) {
			// If theres an enemy on this index
			if (this.enemyList[i] && this.enemyList[i] instanceof Enemy) {
				if ( this.enemyAvoidsAttack( this.enemyList[i] ) ) {
					this.notify({
						state: 'ATTACK_AVOIDED',
						subject: this.enemyList[i].name
					})
					
					j++
					continue
				}

				const dmg = this.enemyList[i].recieveDamage(
					chip.attackValue[j],
					new (coreTypeClass( chip.type ))
				)

				this.notify({ // SUBJECT used CHIP on TARGET
					state: 'CYBER_ATTK_SUCCESS',
					subject: this.navi.name,
					target: enemy.name,
					chip: chip.name,
					damage: dmg
				})

				this.giveStatusTo( this.enemyList[i], chip.type )
			}

			j++
		}
	}

	// Use a 'Heal' target type chip
	doUseHealChip(chip) {
		// Heal the navi
		this.navi.healHP( chip.attackValue[0] )

		if ( this.navi.HP >= this.navi.maxHP ) {
			this.notify({
				state: 'HEAL_HP_FULLY',
				subject: this.navi.name
			})
		}
		else this.notify({
			state: 'HEAL_HP',
			subject: this.navi.name,
			HP: chip.attackValue[0]
		})
	}

	// "Defend" action
	naviDefends() {
		this.notify({
			state: 'NAVI_DEFENDED',
			subject: this.navi.name
		})

		// See doEnemyAttack() to see what is done with this flag
		this.navi.getsStatus('DEFENDED')

		// Recover some CP
		this.navi.healCP( this.navi.defendCPBonus )

		if ( this.navi.CP >= this.navi.maxCP ) {
			this.notify({
				state: 'HEAL_CP_FULLY',
				subject: this.navi.name
			})
		}
		else this.notify({
				state: 'HEAL_CP',
				subject: this.navi.name
			})
	}

	// "Escape" action
	naviEscapes() {
		this.notify({
			state: 'NAVI_ESCAPE',
			subject: this.navi.name
		})

		if (!this.isPossibleToEscape) {
			this.notify({
				state: 'NAVI_CANT_ESCAPE'
			})
			return
		}

		// Randomly assign if navi was able to escape
		this.isEscaped = this.calcRandomBool(this.escapePercent)
		
		if (!this.isEscaped)
			this.notify({
				state: 'NAVI_ESCAPE_FAIL'
			})
	}

	// Enemies' turn
	enemiesTurn() {

		// Let each enemy do their action
		for (const enemy of this.enemyList) {

			// ..As long as they're not an EMPTY_SPACE
			if (enemy instanceof EmptySpace)
				continue

			const attk = enemy.chooseAction()
			
			// Switch case in case other common actions are added like fleeing
			switch (attk) {
			case 'Nothing':
				this.notify({
					state: 'ENEMY_NOTHING',
					subject: enemy.name
				})
				break
			case 'Defend':
				this.notify({
					state: 'ENEMY_DEFENDED',
					subject: enemy.name
				})

				enemy.getsStatus('DEFENDED')
				break
			case 'Dodge':
				this.notify({
					state: 'ENEMY_AVOIDED',
					subject: enemy.name
				})

				enemy.getsStatus('AVOIDED')
				break
			case 'STUNNED':
				this.notify({
					state: 'STUNNED_INJURIES',
					subject: enemy.name
				})

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
				this.notify({
					state: 'ENEMY_ATTK_MISS',
					subject: author.name,
					target: this.navi.name,
					chip: attack.name
				})

				continue
			}

			const dmg = this.navi.recieveDamage( damage, new (coreTypeClass( attack.type )) )

			this.notify({
				state: 'ENEMY_ATTK',
				subject: author.name,
				target: this.navi.name,
				damage: dmg,
				chip: attack.name
			})
		}
	}

	// this.enemyList is modified to its normal state
	// minus the enemies which have 0 or less hp
	enemyLifeCheck() {

		for (const e of this.enemyList) {
			if ( !(e instanceof Enemy) || e.HP > 0 )
				continue

			this.notify({
				state: 'ENEMY_DELETED',
				subject: e.name
			})

			// Save the enemy for later use
			this.deadEnemyList.push( e )

			// And remove them from battle
			const index = this.enemyList.indexOf(e)
			this.enemyList.splice(index, 1, new EmptySpace() )
		}
	}

	enemyStatusCheck() {

		for (const enemy of this.enemyList ) {
			if ( !( enemy instanceof Enemy ) )
				continue

			if ( enemy.hasStatus('BURNED') ) {
				// Check if has an active status

				if ( enemy.statusList['BURNED'].isActive ) {
					enemy.recieveDamage(
						enemy.statusList['BURNED'].burn(),
						new( coreTypeClass('FIRE') )  )

					this.notify({
						state: 'BURN_INJURIES',
						subject: enemy.name
					})
				}
				else enemy.statusList['BURNED'].isActive = true
			}

			enemy.updateStatuses()
		}
	}

	// Based on a float value between 0 and 1 return a random boolean
	calcRandomBool(float) {
		const x = Math.random()
		return x <= float
	}

}