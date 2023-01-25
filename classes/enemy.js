const coreTypeClass = require('./coreTypes')
const getEnemyData = require('../utils/EnemyList')
const getEnemyAttack = require('../utils/EnemyAttacks')

module.exports = class Enemy {

	DEFEND_BONUS = 0.2

	constructor( name ) {
		// Get the stats from said enemy
		const data = getEnemyData( name )

		// Properties from the json
		this.name = data.name
		this.Core = new  coreTypeClass( data.core )
		this.maxHP = data.maxHP
		this.HP = data.HP
		this.CPattacks = data.CPattacks
		this.secuence = data.secuence
		this.drops = data.drops

		// Properties from the class
		this.isDefending = false
		this.isAvoiding = false
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

		if ( this.isDefending )
			dmg = Math.round( dmg * (1 - this.DEFEND_BONUS ) )

		// And do the damage given
		this.HP -= dmg
		if ( this.HP < 0 ) this.HP = 0
	}

	chooseAction() {
		let action = ''

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
			else action = enemy.CPattacks[i]
		}

		return action
	}

	attack( Navi, attackName ) {
		const attack = getEnemyAttack( attackName )

		// Do the array of damage
		for ( const damage of attack.attackValue ) {
			// And as long as it doesn't miss
			const missed = this.calcRandomBool( attack.missChance )

			if ( missed ) continue

			Navi.recieveDamage( damage, new coreTypeClass( attack.type ) )
		}
	}

	calcRandomBool(float) {
		return Math.random() <= float
	}

	
}