const AttackInfo = require('../utils/AttackInfo')
const coreTypeClass = require('./coreTypes')
const Enemy = require('./enemy')
const { Subject } = require('./observer')

class Attack extends Subject {

	// A "tad" of damage is one damage defined in chip.attackValue
	// This function checks if the enemy avoids the attack, makes sure
	// the enemy is hurt, and gives it prover statuses, and logs the results
	dealTadOfDamageTo( enemy, chip, dmg ) {
		// Did it avoid the attack?
		if ( enemy.avoidAttack() ) {
			this.notify({
				state: 'ATTACK_AVOIDED',
				subject: enemy.name,
			})
			return
		}
		
		// Then it's hurt
		const damage = enemy.recieveDamage( dmg, chip.type )
		this.notify({
			state: 'CYBER_ATTK_SUCCESS',
			subject: 'Someone',
			damage: damage,
			target: enemy.name,
			chip: chip.name,
		})

		// And give it a status if needed
		if ( chip.type.status != '' && !enemy.hasStatus( chip.type.status ) ) {
			this.notify({
				state: 'STATUS_GIVEN',
				subject: enemy.name,
				status: chip.type.status,
			})
			enemy.getsStatus( chip.type.status )
		}
	}
}

class SingleAttack extends Attack {
	
	attack( chip, targetArray, indexOfTarget ) {
		// Find the targetted enemy
		const enemy = targetArray[indexOfTarget]

		// And deal an array of damage to it (if it gets hits)
		for (const dmg of chip.attackValue) {

			this.dealTadOfDamageTo( enemy, chip, dmg )
		}
	}
}

class TripleAttack extends Attack {
	attack( chip, targetArray, indexOfTarget ) {

		// Index used to align the target values,
		// it starts at -1 becuase it's increased to 0 inmidiately after
		let valOfDamage = -1 
		
		// Pass through the nearby enemies
		for (let i = indexOfTarget - 1; i <= indexOfTarget + 1; i++) {
			
			// Increase the index for the current damage value
			valOfDamage++
			
			// Find the targetted enemy
			const enemy = targetArray[i]
			
			this.dealTadOfDamageTo( enemy, chip, chip.attackValue[valOfDamage] )
		}
	}
}

class SelfAttack extends Attack {
	attack( chip, targetArray, indexOfTarget ) {
		// Get the navi
		const navi = targetArray[ indexOfTarget ]

		for (const dmg of chip.attackValue) {
			// And hurt it >:}
			this.notify({
				state: 'NAVI_AUTOHURT',
				chip: chip.name,
			})
			navi.recieveDamage( dmg, chip.type )
		}
	}
}

class HealAttack extends Attack {
	attack( chip, targetArray, indexOfTarget ) {
		// Get the navi
		const navi = targetArray[ indexOfTarget ]

		// And heal it
		navi.healHP( chip.attackValue[0] )

		// And notify the results
		if ( navi.HP >= navi.maxHP ) {
			this.notify({
				state: 'HEAL_HP_FULLY'
			})
		} else this.notify({
			state: 'HEAL_HP',
			HP: chip.attackValue[0]
		})
	}
}

class LowAttack extends Attack {
	attack( chip, targetArray, indexOfTarget ) {}
}

class HighAttack extends Attack {
	attack( chip, targetArray, indexOfTarget ) {}
}

class LeftAttack extends Attack {
	attack( chip, targetArray, indexOfTarget ) {}
}

class RightAttack extends Attack {
	attack( chip, targetArray, indexOfTarget ) {}
}

class EveryoneAttack extends Attack {
	attack( chip, targetArray, indexOfTarget ) {

		for (const enemy of targetArray) {
			// Find the targetted enemy
			const enemy = targetArray[indexOfTarget]

			// Is it an enemy?
			if ( enemy == null || !(enemy instanceof Enemy) )
				continue

			// And deal a tad of damage to it
			for (const dmg of chip.attackValue)
				this.dealTadOfDamageTo( enemy, chip, dmg )
		}
	}
}

class ReactAttack {
	attack( chip, targetArray, indexOfTarget ) {
		// Honestly I have no idea what to do
		// Maybe with a status
	}
}

class Chip {

	constructor( chipName ) {
		const { name, type, cpCost, target, attackValue } = AttackInfo( chipName )
		this.name = name
		this.type = new (coreTypeClass( type ))
		this.cpCost = cpCost
		this.target = target
		this.attackValue = attackValue
		this.canTarget = attackValue

		// And with the power of the strategy attack, we can simplefy a lot
		switch ( this.target ) {
			case 'Single':
				this.attk = new SingleAttack()
				break
			case 'Triple':
				this.attk = new TripleAttack()
				break
			case 'Self':
				this.attk = new SelfAttack()
				break
			case 'Heal':
				this.attk = new HealAttack()
				break
			case 'Low':
				this.attk = new LowAttack()
				break
			case 'High':
				this.attk = new HighAttack()
				break
			case 'Left':
				this.attk = new LeftAttack()
				break
			case 'Right':
				this.attk = new RightAttack()
				break
			case 'Everyone':
				this.attk = new EveryoneAttack()
				break
			case 'React':
				this.attk = new ReactAttack()
				break
		}
	}

	attack( targetArray, indexOfTarget ) {
		this.attk.attack( this, targetArray, indexOfTarget )
	}

	attach( observer ) {
		this.attk.attach( observer )
	}

	detach( observer ) {
		this.attk.detach( observer )
	}
}

module.exports = { Chip }