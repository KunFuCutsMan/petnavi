const coreTypeClass = require('./coreTypes')
const statEffectClass = require('./statusEffect')
const getEnemyData = require('../utils/EnemyList')
const getEnemyAttack = require('../utils/EnemyAttacks')

module.exports = class Enemy {

	constructor( name ) {
		// Get the stats from said enemy
		const data = getEnemyData( name )

		// Properties from the json
		this.name = data.name
		this.Core = new (coreTypeClass( data.core ))
		this.maxHP = data.maxHP
		this.HP = data.HP
		this.CPattacks = data.CPattacks
		this.secuence = data.secuence
		this.drops = data.drops

		// Properties from the class
		this.statusList = {}
	}

	getsStatus( statStr ) {
		this.statusList[ statStr ] = new ( statEffectClass(statStr) )
	}

	hasStatus( statStr ) {
		const a = this.statusList[statStr] !== undefined
		const b = this.statusList[ statStr ] instanceof (statEffectClass( statStr ))
		return a && b
	}

	updateStatuses() {
		for (const stat in this.statusList ) {
			const status = this.statusList[ stat ]

			status.decreaseCounter()

			if ( status.isStatusOver() ) {
				delete this.statusList[ stat ]
			}
		}
	}

	recieveDamage( damage, Core = 'NEUTRAL' ) {
		let dmg = damage

		// If a core was given, and its not a NEUTRAL type,
		// calculate its the damage bonus if it applies
		if ( Core !== 'NEUTRAL' && Core.type !== 'NEUTRAL' ) {
			dmg = this.Core.isWeakTo( Core )
				? dmg * 2
				: dmg
		}

		if ( this.hasStatus('DEFENDED') ) {
			dmg = this.statusList['DEFENDED'].getDefendDmg( dmg )
		}

		// And do the damage given
		this.HP -= dmg
		if ( this.HP < 0 ) this.HP = 0

		return dmg
	}

	chooseAction() {
		let action = ''

		if ( this.hasStatus('STUNNED') )
			return 'STUNNED'

		// Get action from secuence if there's one active
		if (this.secuence.length > 0)
			action = this.secuence.shift()
		else {
			// Choose an index
			const i = Math.floor( Math.random() * this.CPattacks.length )
			
			// If its a secuence then copy it to enemy.secuence and use it
			if ( Array.isArray( this.CPattacks[i]) ) {
				this.secuence = [ ...this.CPattacks[i] ]
				action = this.secuence.shift()
			}
			else action = this.CPattacks[i]
		}

		return action
	}

	avoidAttack() {
		if ( this.hasStatus('AVOIDED') ) {

			return this.statusList['AVOIDED'].avoids()
		}
		else return false
	}

	
}