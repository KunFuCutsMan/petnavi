import { getCore, Core } from "./coreTypes"
import { AttackPattern, getEnemyData } from "../utils/EnemyList";
import { AvoidedStatus, DefendedStatus, Status, StatusType, getStatus } from "./statusEffect";

export class Enemy {

	name: string
	readonly core: Core
	readonly maxHP: number
	HP: number
	readonly attacksCP: AttackPattern
	secuence: AttackPattern
	readonly drops: string[]
	readonly statusList: Record<StatusType, Status>


	constructor( name: string ) {
		// Get the stats from said enemy
		const data = getEnemyData( name )

		// Properties from the json
		this.name = data.name
		this.core = getCore( data.core )
		this.maxHP = data.maxHP
		this.HP = data.HP
		this.attacksCP = data.attacksCP
		this.secuence = data.secuence
		this.drops = data.drops

		// Properties from the class
		this.statusList = {} as Record<StatusType, Status>
	}

	getsStatus( status: StatusType ) {
		this.statusList[ status ] = getStatus(status)
	}

	hasStatus( status: StatusType ): boolean {
		return this.statusList[status]?.statusType == status ?? false
	}

	updateStatuses() {
		for ( const stat in this.statusList ) {
			const status = this.statusList[ stat as StatusType ]

			status.decreaseCounter()

			if ( status.isStatusOver() )
				delete this.statusList[ stat as StatusType ]
		}
	}

	recieveDamage( damage: number, core: Core ): number {
		let dmg = damage

		// If a core was given, and its not a NEUTRAL type,
		// calculate its the damage bonus if it applies
			dmg = this.core.isWeakTo( core )
				? dmg * 2
				: dmg

		if ( this.hasStatus('DEFENDED') )
			dmg = (this.statusList['DEFENDED'] as DefendedStatus).getDefendDmg( dmg )

		// And do the damage given
		this.HP -= dmg
		if ( this.HP < 0 ) this.HP = 0

		return dmg
	}

	chooseAction(): string {
		let action: AttackPattern = ''

		if ( this.hasStatus('STUNNED') )
			return 'STUNNED'

		if ( this.secuence instanceof Array && this.secuence.length > 0 ) {
			// If we have a secuence to follow, do so
			action = this.secuence.shift() ?? 'Nothing'
		}
		else {
			// Choose a random action from our base attacks, we may get an array or a string
			const actionIndex = Math.floor( this.attacksCP.length * Math.random() )
			action = this.attacksCP[actionIndex]
		}

		// Either way, if what we get is an array, we will follow that sequence
		if ( action instanceof Array ) {
			this.secuence = [ ...action ]
			action = this.chooseAction()
		}

		return action
	}

	avoidAttack(): boolean {
		if ( this.hasStatus('AVOIDED') )
			return ( this.statusList['AVOIDED'] as AvoidedStatus ).avoids()
		else return false
	}

}