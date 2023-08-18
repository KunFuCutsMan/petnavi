import { NaviFile } from "../types"
import { getCore, Core } from "./coreTypes"
import { DefendedStatus, Status, StatusType, getStatus } from "./statusEffect"

export class Navi {

	DEFEND_BONUS = 0.3
	RECOVERY_BONUS = 0.2
	name: string
	level: number
	core: Core
	maxHP: number
	HP: number
	maxCP: number
	CP: number
	attacksCP: string[]
	willBeDeleted: boolean
	dir: string
	zenny: number
	chipLibrary: string[]
	statusList: Record<StatusType, Status>
	
	constructor ( naviJson: NaviFile ) {

		// Properties from json
		this.name = naviJson.name
		this.level = naviJson.level
		this.core = getCore( naviJson.core )
		this.maxHP = naviJson.maxHP
		this.HP = naviJson.HP
		this.maxCP = naviJson.maxCP
		this.CP = naviJson.CP
		this.attacksCP = [ ...naviJson.attacksCP ]
		this.willBeDeleted = naviJson.willBeDeleted
		this.dir = naviJson.dir
		this.zenny = naviJson.zenny
		this.chipLibrary = [ ...naviJson.chipLibrary ]

		// Properties from the class
		this.statusList = {} as Record<StatusType, Status>
	}

	getsStatus( status: StatusType ) {
		this.statusList[ status ] = getStatus(status)

		if ( this.statusList[ status ] instanceof DefendedStatus )
			(this.statusList[status] as DefendedStatus ).DEFEND_BONUS = this.DEFEND_BONUS
	}

	hasStatus( status: StatusType ) {
		return this.statusList[status].statusType === status ?? false
	}

	updateStatuses() {
		for ( const stat in this.statusList ) {
			const status = this.statusList[ stat as StatusType ]

			status.decreaseCounter()

			if ( status.isStatusOver() ) {
				delete this.statusList[ stat as StatusType ]
			}
		}
	}

	isCPattacksFull() {
		return this.attacksCP.length >= 12
	}

	addToCPattacks( string: string ) {
		this.attacksCP.push( string )
	}

	addToChipLibrary( string: string ) {
		this.chipLibrary.push( string )
	}

	popChipLibraryWithIndex( index: number ) {
		return this.chipLibrary.splice( index, 1 )[0]
	}

	switchCPAttackWithChipInLibrary( idxCPattack: number, idxLibrary: number ) {

		const chipFromCP = this.attacksCP[ idxCPattack ]
		
		const chipFromLibrary = this.chipLibrary.splice( idxLibrary, 1, chipFromCP )[0]
		this.attacksCP.splice( idxCPattack, 1, chipFromLibrary )
	}

	recieveDamage( damage: number, core: Core ) {
		let dmg = damage
		// If a core was given, and its not a NEUTRAL type,
		// calculate its the damage bonus if it applies

		dmg = this.core.isWeakTo( core )
			? dmg * 2
			: dmg

		if ( this.hasStatus( 'DEFENDED' ) )
			dmg = (this.statusList['DEFENDED'] as DefendedStatus).getDefendDmg( dmg )

		// And do the damage given
		this.HP -= dmg
		if ( this.HP < 0 ) this.HP = 0

		return dmg
	}

	healStatsFully() {
		this.healHP( this.maxHP )
		this.healCP( this.maxCP )
	}

	healHP( HP: number ) {
		this.HP += HP
		if ( this.HP > this.maxHP ) { this.HP = this.maxHP }
	}

	healCP( CP: number ) {
		this.CP += CP
		if ( this.CP > this.maxCP ) { this.CP = this.maxCP }
	}

	reduceCP( CP: number ) {
		this.CP -= CP
		if ( this.CP < 0 ) {
			this.CP += CP
			return false
		}
		else return true
	}

	calcRandomBool( float: number ) {
		return Math.random() <= float
	}

	toData(): NaviFile {
		return {
			name: this.name,
			level: this.level,
			core: this.core.coreType,
			maxHP: this.maxHP,
			HP: this.HP,
			maxCP: this.maxCP,
			CP: this.CP,
			attacksCP: [ ...this.attacksCP ],
			willBeDeleted: this.willBeDeleted,
			dir: this.dir,
			zenny: this.zenny,
			chipLibrary: [ ...this.chipLibrary ]
		}
	}

	get defendCPBonus() {
		return Math.ceil( this.maxCP * this.DEFEND_BONUS )
	}

}