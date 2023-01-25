const getAttackChip = require('../utils/AttackInfo')
const coreTypeClass = require('./coreTypes')

module.exports = class Navi {

	DEFEND_BONUS = 0.3
	RECOVERY_BONUS = 0.2
	
	constructor ( naviJson ) {

		// Properties from json
		this.name = naviJson.name
		this.level = naviJson.level
		this.Core = new ( coreTypeClass( naviJson.core ) )
		this.maxHP = naviJson.maxHP
		this.HP = naviJson.HP
		this.maxCP = naviJson.maxCP
		this.CP = naviJson.CP
		this.CPattacks = naviJson.CPattacks
		this.willBeDeleted = naviJson.willBeDeleted
		this.dir = naviJson.dir
		this.zenny = naviJson.zenny
		this.chipLibrary = naviJson.chipLibrary

		// Properties from the class
		this.isDefending = false
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

		return dmg
	}

	healStatsFully() {
		this.healHP( this.maxHP )
		this.healCP( this.maxCP )
	}

	healHP( HP ) {
		this.HP += HP
		if ( this.HP > this.maxHP ) { this.HP = this.maxHP }
	}

	healCP( CP ) {
		this.CP += CP
		if ( this.CP > this.maxCP ) { this.CP = this.maxCP }
	}

	reduceCP( CP ) {
		this.CP -= CP
		if ( this.CP < 0 ) {
			this.CP += CP
			return false
		}
		else return true
	}

	attack( Enemy, attackName ) {
		const attack = getAttackChip( attackName )

		// Do the array of damage
		for ( const damage of attack.attackValue ) {
			// And as long as it doesn't miss
			const missed = this.calcRandomBool( attack.missChance )

			if ( missed ) continue

			Enemy.recieveDamage( damage, new coreTypeClass( attack.type ) )
		}
	}

	calcRandomBool(float) {
		return Math.random() <= float
	}

	get defendCPBonus() {
		return Math.ceil( this.maxCP * this.DEFEND_BONUS )
	}

}