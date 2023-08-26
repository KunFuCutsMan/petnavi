import { Observer } from "../utils/observer"
import c from "ansi-colors";

const sleep = (ms = 2000) => new Promise( (r) => setTimeout( r, ms ) )

export type validStates =
	'ATTACK' | 'ATTACK_SUCCESS' | 'ATTACK_AVOIDED' |
	'HEAL_HP' | 'HEAL_HP_FULLY' | 'HEAL_CP' | 'HEAL_CP_FULLY' |
	'CP_LACKING' |
	'CYBER_ATTK_USE' | 'CYBER_ATTK_FAIL' | 'CYBER_ATTK_SUCCESS' |
	'NAVI_ESCAPE' | 'NAVI_ESCAPE_FAIL' | 'NAVI_CANT_ESCAPE' |
	'NAVI_DEFENDED' | 'NAVI_AVOIDED' | 'NAVI_AUTOHURT' |
	'STATUS_GIVEN' | 'BURN_INJURIES' | 'STUNNED_INJURIES' |
	'ENEMY_NOTHING' | 'ENEMY_DEFENDED' | 'ENEMY_AVOIDED' |
	'ENEMY_ATTK' | 'ENEMY_ATTK_MISS' | 'ENEMY_DELETED' |
	'NOT_IMPLEMENTED'

/**
 * Whatever happens in a battle, depending of the state
 * subject: name of whoever does the action
 * target?: whoever is dealt the action to, if its applies
 * chip?: the name of the attack used
 * damage?: damage dealt
 * HP?: HP recovered
 * Status?: Status that was inficted
 * */
export interface LoggingState {
	/**
	 * A valid State
	 */
	readonly state: validStates
	/**
	 * Whoever did the action
	 */
	readonly subject?: string
	/**
	 * To whom the action was directed to
	 */
	readonly target?: string
	/**
	 * Name of the attack used
	 */
	readonly attackName?: string
	/**
	 * How much damage was dealt to `target`
	 */
	readonly damage?: number
	/**
	 * HP recovered
	 */
	readonly HP?: number
	/**
	 * Status given
	 */
	readonly status?: string
}

export class Logger implements Observer {

	private queue: string[] = []

	update( s: LoggingState ) {

		let str = ''

		switch ( s.state ) {
		case 'ATTACK':
			str = `${s.subject}'s buster aimed at ${s.target}...`
			break
		case 'ATTACK_SUCCESS':
			str = `...and damaged ${s.subject}!`
			break
		case 'ATTACK_AVOIDED':
			str = `...but ${s.subject} avoided the attack!`
			break
		case 'HEAL_HP':
			str = `${s.subject} recovered ${s.HP} HP!`
			break
		case 'HEAL_HP_FULLY':
			str = `${s.subject} recovered all of their HP!`
			break
		case 'HEAL_CP':
			str = `${s.subject} recovered some of their CP!`
			break
		case 'HEAL_CP_FULLY':
			str = `${s.subject} recovered all of their CP!`
			break
		case 'CP_LACKING':
			str = `...but there are not enough CP!`
			break
		case 'CYBER_ATTK_USE':
			str = `${s.subject} used ${s.attackName}!`
			break
		case 'CYBER_ATTK_SUCCESS':
			str = `${s.subject} dealt ${s.damage} damage to ${s.target} using ${s.attackName}!`
			break
		case 'NAVI_ESCAPE':
			str = `${s.subject} attempted to escape the battle...`
			break
		case 'NAVI_ESCAPE_FAIL':
			str = `...but failed to do so!`
			break
		case 'NAVI_CANT_ESCAPE':
			str = `...but its not possible to escape!`
			break
		case 'NAVI_DEFENDED':
			str = `${s.subject} defended agaisnt any attacks`
			break
		case 'NAVI_AVOIDED':
			str = `${s.subject} attempted to avoid any attacks`
			break
		case 'NAVI_AUTOHURT':
			str = `${s.subject} got hurt using ${s.attackName}!`
		case 'STATUS_GIVEN':
			str = `${s.subject} got ${s.status}!`
			break
		case 'BURN_INJURIES':
			str = `${s.subject} got burning injuries`
			break
		case 'STUNNED_INJURIES':
			str = `${s.subject} is stunned and cannot do anything!`
			break
		case 'ENEMY_NOTHING':
			str = `${s.subject} did absolutely nothing!`
			break
		case 'ENEMY_DEFENDED':
			str = `${s.subject} will defend the next turn`
			break
		case 'ENEMY_AVOIDED':
			str = `${s.subject} will avoid any attacks the next turn`
			break
		case 'ENEMY_ATTK':
			str = `${s.subject}'s ${s.attackName} dealt ${s.damage} damage to ${s.target}!`
			break
		case 'ENEMY_ATTK_MISS':
			str = `${s.subject}'s ${s.attackName} missed ${s.target}!`
			break
		case 'ENEMY_DELETED':
			str = `${s.subject} was deleted!`
			break
		case 'NOT_IMPLEMENTED':
			str = `This action is not implemented yet!`
			break
		}

		if ( str.length > 0 )
			this.queue.push( str )
	}

	async logActionQueue() {
		for (const str of this.queue) {
			console.log(`${c.dim.green('›')} ${str}`)
			await sleep(1000)
		}

		this.queue = []
	}
}