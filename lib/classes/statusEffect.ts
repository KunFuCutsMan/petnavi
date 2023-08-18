import * as c from "ansi-colors"

export type StatusType =
	"DEFENDED"
	| "AVOIDED"
	| "BURNED"
	| "STUNNED"

export abstract class Status {

	static CHANCE_TO_STATUS = 0.3
	abstract readonly statusType: StatusType
	abstract counter: number
	abstract symbol: string

	decreaseCounter(): void {
		this.counter--
	}

	isStatusOver(): boolean {
		return this.counter < 0
	}

}

export class DefendedStatus extends Status {

	DEFEND_BONUS = 0.2
	statusType: StatusType
	counter: number
	symbol: string

	constructor() {
		super()
		this.statusType = "DEFENDED"
		this.symbol = c.bold.gray('■')
		this.counter = 1
	}

	getDefendDmg( dmg: number ): number {
		return Math.round( dmg * (1 - this.DEFEND_BONUS ) )
	}
}

export class AvoidedStatus extends Status {
	
	AVOID_BONUS = 0.4
	statusType: StatusType
	counter: number
	symbol: string

	constructor() {
		super()
		this.statusType = "AVOIDED"
		this.counter = 1
		this.symbol = c.bold.cyan('○')
	}

	avoids(): boolean {
		return this.calcRandomBool( this.AVOID_BONUS )
	}

	calcRandomBool(float: number): boolean {
		return Math.random() <= float
	}
}

export class BurnedStatus extends Status {

	BURN_DAMAGE = 10
	isActive: boolean

	statusType: StatusType
	counter: number
	symbol: string

	constructor() {
		super()
		this.isActive = false
		this.statusType = "BURNED"
		this.counter = 1
		this.symbol = c.bold.red('▲')
	}

	burn() {
		return this.BURN_DAMAGE
	}
}

export class StunnedStatus extends Status {

	statusType: StatusType
	counter: number
	symbol: string

	constructor() {
		super()
		this.statusType = "STUNNED"
		this.counter = 2
		this.symbol = c.bold.yellow('*')
	}
}

export function getStatus( status: StatusType ): Status {
	switch ( status ) {
		case "DEFENDED": return new DefendedStatus()
		case "AVOIDED": return new AvoidedStatus()
		case "BURNED": return new BurnedStatus()
		case "STUNNED": return new StunnedStatus()
	}
}