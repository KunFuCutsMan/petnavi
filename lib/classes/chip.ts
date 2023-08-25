import Logger from "../graphics/logger"
import { BattleSpace } from "../utils/BattleManager"
import { ChipAttackTarget, getChipInfo } from "../utils/chipAttackInfo"
import { EmptySpace } from "./EmptySpace"
import { Core, getCore } from "./coreTypes"
import { Enemy } from "./enemy"
import { Navi } from "./navi"
import { Subject } from "./observer"
import { StatusType } from "./statusEffect"

type Hittable = Navi | Enemy

export abstract class Attack extends Subject {

	abstract attack( chip: Chip, targetArray: Array<Hittable | EmptySpace>, indexOfTarget: number ): void

	// A "tad" of damage is one damage defined in chip.attackValue
	// This function checks if the enemy avoids the attack, makes sure
	// the enemy is hurt, and gives it prover statuses, and logs the results
	protected dealTadOfDamageTo( enemy: Enemy, chip: Chip, dmg: number ) {
		// Did it avoid the attack?
		if ( enemy.avoidAttack() ) {
			this.notify({
				state: 'ATTACK_AVOIDED',
				subject: enemy.name,
			})
			return
		}
		
		// Then it's hurt
		const damage = enemy.recieveDamage( dmg, chip.core )
		this.notify({
			state: 'CYBER_ATTK_SUCCESS',
			subject: 'Someone',
			damage: damage,
			target: enemy.name,
			chip: chip.name,
		})

		if ( chip.core.status && !enemy.hasStatus( chip.core.status as StatusType ) ) {
			enemy.getsStatus( chip.core.status as StatusType )
			this.notify({
				state: 'STATUS_GIVEN',
				subject: enemy.name,
				status: chip.core.coreType
			})
		}
	}
}

class SingleAttack extends Attack {
	
	attack( chip: Chip, targetArray: Array<Hittable | EmptySpace>, indexOfTarget: number ): void {
		// Find the targetted enemy
		const enemy = targetArray[indexOfTarget]

		if ( !(enemy instanceof Enemy) )
			return

		// And deal an array of damage to it (if it gets hits)
		for (const dmg of chip.attackValue)
			this.dealTadOfDamageTo( enemy, chip, dmg )
	}
}

class TripleAttack extends Attack {
	attack( chip: Chip, targetArray: Array<Hittable | EmptySpace>, indexOfTarget: number ) {

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
			if ( !(enemy instanceof Enemy) )
				continue
			
			this.dealTadOfDamageTo( enemy, chip, chip.attackValue[valOfDamage] )
		}
	}
}

class SelfAttack extends Attack {
	attack( chip: Chip, targetArray: Array<Hittable | EmptySpace>, indexOfTarget: number ) {
		// Get the navi
		const navi = targetArray[ indexOfTarget ]

		if ( !(navi instanceof Navi) )
			return

		for (const dmg of chip.attackValue) {
			// And hurt it >:}
			this.notify({
				state: 'NAVI_AUTOHURT',
				chip: chip.name,
			})
			navi.recieveDamage( dmg, chip.core )
		}
	}
}

class HealAttack extends Attack {
	attack( chip: Chip, targetArray: Array<Hittable | EmptySpace>, indexOfTarget: number ) {
		// Get the navi
		const navi = targetArray[ indexOfTarget ]

		if ( !(navi instanceof Navi) )
			return

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
	attack( chip: Chip, targetArray: Array<Hittable | EmptySpace>, indexOfTarget: number ) {}
}

class HighAttack extends Attack {
	attack( chip: Chip, targetArray: Array<Hittable | EmptySpace>, indexOfTarget: number ) {}
}

class LeftAttack extends Attack {
	attack( chip: Chip, targetArray: Array<Hittable | EmptySpace>, indexOfTarget: number ) {}
}

class RightAttack extends Attack {
	attack( chip: Chip, targetArray: Array<Hittable | EmptySpace>, indexOfTarget: number ) {}
}

export class EveryoneAttack extends Attack {
	attack( chip: Chip, targetArray: Array<Hittable | EmptySpace>, indexOfTarget: number ) {

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

export class ReactAttack extends Attack {
	attack( chip: Chip, targetArray: Array<Hittable | EmptySpace>, indexOfTarget: number ) {
		// Honestly I have no idea what to do
		// Maybe with a status
	}
}

export class Chip extends Logger {

	readonly name: string
	readonly core: Core
	readonly cpCost: number
	readonly target: ChipAttackTarget
	readonly attackValue: number[]
	readonly canTarget: boolean

	readonly attk: Attack

	constructor( chipName: string ) {
		super()
		const { name, type, cpCost, target, attackValue, canTarget } = getChipInfo( chipName )
		this.name = name
		this.core = getCore( type )
		this.cpCost = cpCost
		this.target = target
		this.attackValue = attackValue
		this.canTarget = canTarget

		// And with the power of the strategy attack, we can simplefy a lot
		switch ( this.target ) {
			case 'SINGLE':
				this.attk = new SingleAttack()
				break
			case 'TRIPLE':
				this.attk = new TripleAttack()
				break
			case 'SELF':
				this.attk = new SelfAttack()
				break
			case 'HEAL':
				this.attk = new HealAttack()
				break
			case 'LOW':
				this.attk = new LowAttack()
				break
			case 'HIGH':
				this.attk = new HighAttack()
				break
			case 'LEFT':
				this.attk = new LeftAttack()
				break
			case 'RIGHT':
				this.attk = new RightAttack()
				break
			case 'EVERYONE':
				this.attk = new EveryoneAttack()
				break
			case 'REACT':
				this.attk = new ReactAttack()
				break
		}
	}

	attack( targetArray: BattleSpace | Navi[], indexOfTarget: number ) {
		this.attk.attack( this, targetArray, indexOfTarget )
	}
}