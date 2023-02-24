const getAttackChip = require('../utils/AttackInfo')
const coreTypeClass = require('./coreTypes')
const statEffectClass = require('./statusEffect')

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
		this.CPattacks = [ ...naviJson.CPattacks ]
		this.willBeDeleted = naviJson.willBeDeleted
		this.dir = naviJson.dir
		this.zenny = naviJson.zenny
		this.chipLibrary = [ ...naviJson.chipLibrary ]

		// Properties from the class
		this.statusList = {}
	}

	getsStatus( statStr ) {
		this.statusList[ statStr ] = new ( statEffectClass(statStr) )

		if ( statStr === 'DEFENDED' )
			this.statusList['DEFENDED'].defense = this.DEFEND_BONUS
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

	isCPattacksFull() {
		return this.CPattacks.length >= 12
	}

	addToCPattacks( string ) {
		this.CPattacks.push( string )
	}

	addToChipLibrary( string ) {
		this.chipLibrary.push( string )
	}

	popChipLibraryWithIndex( index ) {
		return this.chipLibrary.splice( index, 1 )[0]
	}

	switchCPAttackWithChipInLibrary( idxCPattack, idxLibrary ) {

		const chipFromCP = this.CPattacks[ idxCPattack ]
		
		const chipFromLibrary = this.chipLibrary.splice( idxLibrary, 1, chipFromCP )[0]
		this.CPattacks.splice( idxCPattack, 1, chipFromLibrary )
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

		if ( this.hasStatus( 'DEFENDED' ) )
			dmg = this.statusList['DEFENDED'].getDefendDmg( dmg )

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

	toData() {
		const data = {
			name: this.name,
			level: this.level,
			core: this.Core.type,
			maxHP: this.maxHP,
			HP: this.HP,
			maxCP: this.maxCP,
			CP: this.CP,
			CPattacks: [ ...this.CPattacks ],
			willBeDeleted: this.willBeDeleted,
			dir: this.dir,
			zenny: this.zenny,
			chipLibrary: [ ...this.chipLibrary ]
		}

		return data
	}

	get defendCPBonus() {
		return Math.ceil( this.maxCP * this.DEFEND_BONUS )
	}

}