const getAttackChip = require('../utils/AttackInfo')

module.exports = class Navi {

	DEFEND_BONUS = 0.3
	RECOVERY_BONUS = 0.2
	
	constructor ( naviJson ) {

		// Properties from json
		this.name = naviJson.name
		this.level = naviJson.level
		this.core = naviJson.core
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

		if ( this.isNaviDefending )
			dmg = Math.round( dmg * (1 - this.DEFEND_BONUS ) )

		// And do the damage given
		this.HP -= dmg
		if ( this.HP < 0 ) this.HP = 0
	}

	healHP( HP ) {
		this.HP += HP
		if ( this.HP > this.maxHP ) { this.HP = this.maxHP }
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

}