
class Status {

	CHANCE_TO_STATUS = 0.3

	constructor( status ) {
		this.status = status
		this.counter = 0
	}

	decreaseCounter() {
		this.counter--
	}

	isStatusOver() {
		return this.counter < 0
	}

}

class DefendedStatus extends Status {

	DEFEND_BONUS = 0.2

	constructor() {
		super('DEFENDED')
	}

	getDefendDmg( dmg ) {
		return Math.round( dmg * (1 - this.DEFEND_BONUS ) )
	}
}

class AvoidedStatus extends Status {

	AVOID_BONUS = 0.4

	constructor() {
		super('AVOIDED')
	}

	avoids() {
		return this.calcRandomBool( this.AVOID_BONUS )
	}

	calcRandomBool(float) {
		return Math.random() <= float
	}
}

class BurnedStatus extends Status {

	BURN_DAMAGE = 10

	constructor() {
		super('BURNED')
		this.isActive = false
		this.counter = 1
	}

	burn() {
		return this.BURN_DAMAGE
	}
}

class StunnedStatus extends Status {

	constructor() {
		super('STUNNED')
		this.counter = 2
	}
}

module.exports = function( status = '' ) {
	switch( status.toUpperCase() ) {
	case 'DEFENDED': return DefendedStatus
	case 'AVOIDED': return AvoidedStatus
	case 'BURNED': return BurnedStatus
	case 'STUNNED': return StunnedStatus
	default: return Status
	}
}