const { Observer } = require('../classes')
const c = require('ansi-colors')

const sleep = (ms = 2000) => new Promise( (r) => setTimeout( r, ms ) )

const stateArray = [
	'ATTACK', 'ATTACK_SUCCESS', 'ATTACK_AVOIDED',
	'HEAL_HP', 'HEAL_HP_FULLY', 'HEAL_CP', 'HEAL_CP_FULLY', 'CP_LACKING',
	'CYBER_ATTK_USE', 'CYBER_ATTK_FAIL', 'CYBER_ATTK_SUCCESS',
	'NAVI_ESCAPE', 'NAVI_ESCAPE_FAIL', 'NAVI_CANT_ESCAPE',
	'NAVI_DEFENDED', 'NAVI_AVOIDED', 'NAVI_AUTOHURT',
	'STATUS_GIVEN', 'BURN_INJURIES', 'STUNNED_INJURIES',
	'ENEMY_NOTHING', 'ENEMY_DEFENDED', 'ENEMY_AVOIDED',
	'ENEMY_ATTK', 'ENEMY_ATTK_MISS', 'ENEMY_DELETED',
	'NOT_IMPLEMENTED'
]


module.exports = class Logger extends Observer {

	constructor( naviName ) {
		super()
		this.queue = []
		this.naviName = naviName
	}

	/**
	 * State is a hash that requires the following:
	 * 
	 * state
	 * subject: name of whoever does the action
	 * target?: whoever is dealt the action to, if its applies
	 * chip?: the name of the attack used
	 * damage?: damage dealt
	 * HP?: HP recovered
	 * Status?: Status that was inficted
	 * */

	isValidState( state ) {
		return stateArray.includes( state )
	}

	update( State ) {
		if ( !this.isValidState( State.state ) ) return

		let str = ''

		switch ( State.state ) {
		case 'ATTACK':
			str = `${this.naviName}'s buster aimed at ${State.target}...`
			break
		case 'ATTACK_SUCCESS':
			str = `...and damaged ${State.subject}!`
			break
		case 'ATTACK_AVOIDED':
			str = `...but ${State.subject} avoided the attack!`
			break
		case 'HEAL_HP':
			str = `${this.naviName} recovered ${State.HP} HP!`
			break
		case 'HEAL_HP_FULLY':
			str = `${this.naviName} recovered all of their HP!`
			break
		case 'HEAL_CP':
			str = `${this.naviName} recovered some of their CP!`
			break
		case 'HEAL_CP_FULLY':
			str = `${this.naviName} recovered all of their CP!`
			break
		case 'CP_LACKING':
			str = `...but there are not enough CP!`
			break
		case 'CYBER_ATTK_USE':
			str = `${this.naviName} used ${State.chip}!`
			break
		case 'CYBER_ATTK_SUCCESS':
			str = `${this.naviName} dealt ${State.damage} damage to ${State.target} using ${State.chip}!`
			break
		case 'NAVI_ESCAPE':
			str = `${this.naviName} attempted to escape the battle...`
			break
		case 'NAVI_ESCAPE_FAIL':
			str = `...but failed to do so!`
			break
		case 'NAVI_CANT_ESCAPE':
			str = `...but its not possible to escape!`
			break
		case 'NAVI_DEFENDED':
			str = `${this.naviName} defended agaisnt any attacks`
			break
		case 'NAVI_AVOIDED':
			str = `${this.naviName} attempted to avoid any attacks`
			break
		case 'NAVI_AUTOHURT':
			str = `${this.naviName} got hurt using ${State.chip}!`
		case 'STATUS_GIVEN':
			str = `${State.subject} got ${State.status}!`
			break
		case 'BURN_INJURIES':
			str = `${State.subject} got burning injuries`
			break
		case 'STUNNED_INJURIES':
			str = `${State.subject} is stunned and cannot do anything!`
			break
		case 'ENEMY_NOTHING':
			str = `${State.subject} did absolutely nothing!`
			break
		case 'ENEMY_DEFENDED':
			str = `${State.subject} will defend the next turn`
			break
		case 'ENEMY_AVOIDED':
			str = `${State.subject} will avoid any attacks the next turn`
			break
		case 'ENEMY_ATTK':
			str = `${State.subject}'s ${State.chip} dealt ${State.damage} damage to ${this.naviName}!`
			break
		case 'ENEMY_ATTK_MISS':
			str = `${State.subject}'s ${State.chip} missed ${this.naviName}!`
			break
		case 'ENEMY_DELETED':
			str = `${State.subject} was deleted!`
			break
		case 'NOT_IMPLEMENTED':
			str = `This action is not implemented yet!`
			break
		}

		if ( str !== '' )
			this.queue.push( str )
	}

	async logActionQueue() {
		for (const str of this.queue) {
			console.log( c.dim.green('›') + ' ' + str)
			await sleep(1000)
		}

		this.queue = []
	}
}