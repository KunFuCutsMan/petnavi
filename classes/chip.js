const AttackInfo = require('../utils/AttackInfo')
const coreTypeClass = require('./coreTypes')
const Enemy = require('./enemy')

class SingleAttack {
	attack( chip, targetArray, indexOfTarget ) {
		// Find the targetted enemy
		const enemy = targetArray[indexOfTarget]

		// And deal an array of damage to it (if it gets hits)
		for (const dmg of chip.attackValue) {

			// Did it avoid the attack?
			if ( enemy.avoidAttack() ) {
				console.log("Enemy avoided attack")
				continue
			}
			
			// Then it's hurt
			console.log("Enemy attacked")
			enemy.recieveDamage( dmg, chip.type )

			// And give it a status if needed
			if ( chip.type.status != null ) {
				console.log("Got status:" + chip.type.status)
				enemy.getsStatus( chip.type.status )
			}
		}
	}
}

class TripleAttack {
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
			
			// Is it an enemy?
			if ( enemy == null || !(enemy instanceof Enemy) ) {
				console.log("Not an enemy lol")
				continue
			}

			// Did it avoid the attack?
			if ( enemy.avoidAttack() ) {
				console.log("Enemy avoided attack")
				continue
			}

			// Then it's hurt
			console.log("Enemy attacked")
			enemy.recieveDamage( chip.attackValue[ valOfDamage ], chip.type )

			// And give it a status if needed
			if ( chip.type.status != null ) {
				console.log("Got status:" + chip.type.status)
				enemy.getsStatus( chip.type.status )
			}
		}
	}
}

class SelfAttack {
	attack( chip, targetArray, indexOfTarget ) {
		// Get the navi
		const navi = targetArray[ indexOfTarget ]

		for (const dmg of chip.attackValue) {
			// And hurt it >:}
			console.log("Navi got hurt")
			navi.recieveDamage( dmg, chip.type )
		}
	}
}

class HealAttack {
	attack( chip, targetArray, indexOfTarget ) {
		// Get the navi
		const navi = targetArray[ indexOfTarget ]

		// And heal it
		navi.healHP( chip.attackValue[0] )

		// And notify the results
		if ( navi.HP >= navi.maxHP ) {
			console.log("Navi fully healed")
		} else {
			console.log("Navi got healed")
		}
	}
}

class LowAttack {
	attack( chip, targetArray, indexOfTarget ) {}
}

class HighAttack {
	attack( chip, targetArray, indexOfTarget ) {}
}

class LeftAttack {
	attack( chip, targetArray, indexOfTarget ) {}
}

class RightAttack {
	attack( chip, targetArray, indexOfTarget ) {}
}

class EveryoneAttack {
	attack( chip, targetArray, indexOfTarget ) {

		for (const enemy of targetArray) {
			// Find the targetted enemy
			const enemy = targetArray[indexOfTarget]

			// Is it an enemy?
			if ( enemy == null || !(enemy instanceof Enemy) ) {
				console.log("Not an enemy lol")
				continue
			}

			// And deal an array of damage to it (if it gets hits)
			for (const dmg of chip.attackValue) {

				// Did it avoid the attack?
				if ( enemy.avoidAttack() ) {
					console.log("Enemy avoided attack")
					continue
				}

				// Then it's hurt
				console.log("Enemy attacked")
				enemy.recieveDamage( dmg, chip.type )

				// And give it a status if needed
				if ( chip.type.status != null ) {
					console.log("Got status:" + chip.type.status)
					enemy.getsStatus( chip.type.status )
				}
			}
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
}

module.exports = { Chip }