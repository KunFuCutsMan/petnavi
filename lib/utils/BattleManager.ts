import { EmptySpace } from "../classes/EmptySpace"
import { Chip } from "../classes/chip"
import { getCore } from "../classes/coreTypes"
import { Enemy } from "../classes/enemy"
import { Navi } from "../classes/navi"
import { Observer, Subject } from "./observer"
import { BurnedStatus } from "../classes/statusEffect"
import { BattleUI } from "../graphics/BattleUI"
import { getEnemyAttack } from "./EnemyAttacks"
import { Logger, LoggingState } from "../graphics/logger"

const UI = new BattleUI()
const logger = new Logger()

export type BattleSpace = Array< Enemy | EmptySpace >

export class BattleManager implements Subject {
	
	// How likely are you able to escape
	escapePercent = 0.2

	navi: Navi
	enemyList: BattleSpace
	deadEnemyList: BattleSpace = []
	isEscaped: boolean = false

	readonly canEscapeBattle: boolean

	constructor( navi: Navi, enemyList: BattleSpace, canEscape: boolean ) {
		
		this.navi = navi
		this.enemyList = this.renameToUniqueEnemies( enemyList )
		
		// Setting up for being able to escape
		this.canEscapeBattle = canEscape

		// And attach the logger
		this.attach( logger )
	}

	observers: Observer<LoggingState>[] = []

	attach(o: Observer): void {
		if ( this.observers.includes( o ) )
			return
		this.observers.push(o)
	}
	detach(o: Observer): void {
		const observerIdx = this.observers.indexOf( o )
		if ( observerIdx === -1 )
			return
		this.observers.splice( observerIdx, 1 )
	}
	notify(s: LoggingState): void {
		for ( const o of this.observers )
			o.update( s )
	}

	// Gets an array of enemy names, returns an array of said enemies
	private renameToUniqueEnemies( enemyList: BattleSpace ): BattleSpace {
		let list: BattleSpace = []
		let enemyCount: Record<string, number> = {} // Object that will be used to count enemies

		for (const enemy of enemyList) {
			if ( enemy instanceof EmptySpace ) {
				list.push( enemy )
				continue
			}

			// Increase the count of that enemy's occurances
			if (enemyCount[ enemy.name ] == undefined)
				enemyCount[ enemy.name ] = 1
			else enemyCount[ enemy.name ]++

			// Add the number if there's another enemy
			if ( enemyCount[ enemy.name ] > 1 )
				enemy.name += enemyCount[ enemy.name ]

			list.push( enemy )
		}

		return list
	}

	// Loop as seen previously in battle.js
	public async mainLoop() {
		while ( !this.isBattleOver() ) {
			
			// Decide what to do
			const acts = await UI.showMenuAndAskActions( this.navi, this.enemyList )

			// Do actions
			switch ( acts.action ) {
				case 'Attack':
					this.naviAttacks(acts.target)
					break
				case 'Cyber Actions':
					this.naviCyberAttacks(acts.target, acts.cpattk)
					break
				case 'Defend':
					this.naviDefends()
					break
				case 'Escape':
					this.naviEscapes()
					break
			}

			this.enemyStatusCheck()
			this.enemyLifeCheck()

			// If battle isn't escaped let the enemies attack
			if( !this.isEscaped )
				this.enemiesTurn()

			this.navi.updateStatuses()

			// Log what happened
			await logger.logActionQueue()
		}
	}

	public calcResultsOfBattle() {
		let result = { res : '', str : '' }

		switch ( this.getOutcomeOfBattle() ) {
		case 'ESCAPED':
			result.res = "ESCAPED"
			result.str = "You've escaped the battle"
			break;
		
		case 'WON':
			// Give monies or chips

			if ( this.calcRandomBool(0.5) ) {
				// Drop a chip
				let chipsAvailable: string[] = [];
				
				for (const enemy of this.deadEnemyList)
					if ( enemy instanceof Enemy )
						chipsAvailable = chipsAvailable.concat( enemy.drops )

				const j = Math.floor( Math.random() * chipsAvailable.length )
				const chipChosen = chipsAvailable[ j ]

				this.navi.chipLibrary.push( chipChosen )
				
				result.res = "CHIP"
				result.str = "You got: " + chipChosen
			}
			else {
				// Gain some zenny
				let zennies = 0
				for (const enemy of this.deadEnemyList)
					if ( enemy instanceof Enemy )
						zennies += enemy.maxHP

				zennies *= 5

				this.navi.zenny += zennies

				result.res = "ZENNIES"
				result.str = "You got: " + zennies + " zenny"
			}

			break
	
		case 'LOST':
			if ( this.navi.willBeDeleted ) {
				result.res = "DELETION_NOW"
				result.str = "Your navi was deleted"
			} else {
				this.navi.willBeDeleted = true

				result.res = "DELETION_SOON"
				result.str = "Your navi is headed to deletion"
			}
		}
		
		return result
	}

	//Get the especified enemy
	private getEspecifiedEnemy(name: string) {
		return this.enemyList.find( (o): o is Enemy => {
			return o instanceof Enemy && o.name === name
		} )
	}

	// Get the outcome of the battle
	private getOutcomeOfBattle(): 'ESCAPED' | 'LOST' | 'WON' | string {
		if (this.isEscaped)
			return 'ESCAPED'
		else if (this.navi.HP <= 0)
			return 'LOST'
		else if ( this.enemyList.every( e => e instanceof EmptySpace ) )
			return 'WON'
		else {
			console.error('Something strange happened during the battle:',
				this.navi, this.enemyList, this.isEscaped)
			return ''
		}
	}

	// Either if the battle was escaped from, navi has no HP, or enemies are EMPTY_SPACE
	private isBattleOver() {
		const isEscaped = this.isEscaped
		const isNaviDead = this.navi.HP <= 0
		const areEnemiesDead = this.enemyList.every( e => e instanceof EmptySpace )
		return isEscaped || isNaviDead || areEnemiesDead
	}

	// "Attack" action
	private naviAttacks(target: string) {
		const enemy = this.getEspecifiedEnemy(target)

		if ( !enemy )
			return

		this.notify({
			state: 'ATTACK',
			subject: this.navi.name
		})

		// check if the target will avoid the attack
		if ( enemy.avoidAttack() ) {
			this.notify({
				state: 'ATTACK_AVOIDED',
				subject: enemy.name
			})

			return
		}

		this.notify({
			state: 'ATTACK_SUCCESS',
			subject: enemy.name
		})
		
		enemy.recieveDamage( 10, getCore("NEUTRAL") )
	}

	// "Cyber Actions" attack
	private naviCyberAttacks(target: string, cpAttack: string) {
		const chip = new Chip( cpAttack )
		const enemy = this.getEspecifiedEnemy(target)

		if ( !enemy )
			return

		this.notify({
			state: 'CYBER_ATTK_USE',
			subject: this.navi.name,
			attackName: chip.name
		})

		// check if chip is usable
		if ( !this.navi.reduceCP( chip.cpCost ) ) {
			this.notify({ // Not enough CP
				state: 'CP_LACKING'
			})
			return
		}

		// check chip's target type and do damage to corresponding targets
		chip.attach( logger )
		if ( chip.target !== "HEAL" ) {
			chip.attack( this.enemyList, this.enemyList.indexOf( enemy ) )
		}
		else if ( chip.target == 'HEAL' || chip.target == 'SELF' ) {
			chip.attack( [ this.navi ], 0 )
		}
		else {
			this.notify({ state: 'NOT_IMPLEMENTED'})
		}
		chip.detach( logger )
	}

	// "Defend" action
	private naviDefends() {
		this.notify({ state: 'NAVI_DEFENDED', subject: this.navi.name })

		// See doEnemyAttack() to see what is done with this flag
		this.navi.getsStatus('DEFENDED')

		// Recover some CP
		this.navi.healCP( this.navi.defendCPBonus )

		if ( this.navi.CP >= this.navi.maxCP )
			this.notify({ state: 'HEAL_CP_FULLY', subject: this.navi.name })
		else this.notify({ state: 'HEAL_CP', subject: this.navi.name })
	}

	// "Escape" action
	private naviEscapes() {
		this.notify({ state: 'NAVI_ESCAPE', subject: this.navi.name })

		if (!this.canEscapeBattle) {
			this.notify({ state: 'NAVI_CANT_ESCAPE', subject: this.navi.name })
			return
		}

		// Randomly assign if navi was able to escape
		this.isEscaped = this.calcRandomBool(this.escapePercent)
		
		if (!this.isEscaped)
			this.notify({ state: 'NAVI_ESCAPE_FAIL', subject: this.navi.name })
	}

	// Enemies' turn
	private enemiesTurn() {

		// Let each enemy do their action
		for (const enemy of this.enemyList) {

			// ..As long as they're not an EMPTY_SPACE
			if (enemy instanceof EmptySpace)
				continue

			const attk = enemy.chooseAction()
			
			// Switch case in case other common actions are added like fleeing
			switch (attk) {
			case 'Nothing':
				this.notify({
					state: 'ENEMY_NOTHING',
					subject: enemy.name
				})
				break
			case 'Defend':
				this.notify({
					state: 'ENEMY_DEFENDED',
					subject: enemy.name
				})

				enemy.getsStatus('DEFENDED')
				break
			case 'Dodge':
				this.notify({
					state: 'ENEMY_AVOIDED',
					subject: enemy.name
				})

				enemy.getsStatus('AVOIDED')
				break
			case 'STUNNED':
				this.notify({
					state: 'STUNNED_INJURIES',
					subject: enemy.name
				})

				break
			default:
				this.doEnemyAttack( attk, enemy )
			}
		}
	}

	// Let that enemy attack
	private doEnemyAttack(attk: string, author: Enemy) {
		const attack = getEnemyAttack(attk)

		// Do an array of damage
		for (const damage of attack.attackValue) {

			// Check if that especific dmg missed
			const missed = this.calcRandomBool(attack.missChance)

			if (missed) {
				this.notify({
					state: 'ENEMY_ATTK_MISS',
					subject: author.name,
					attackName: attack.name
				})

				continue
			}

			const dmg = this.navi.recieveDamage( damage, getCore( attack.type ) )

			this.notify({
				state: 'ENEMY_ATTK',
				subject: author.name,
				damage: dmg,
				attackName: attack.name
			})
		}
	}

	// this.enemyList is modified to its normal state
	// minus the enemies which have 0 or less hp
	private enemyLifeCheck() {

		for (const e of this.enemyList) {
			if ( !(e instanceof Enemy) || e.HP > 0 )
				continue

			this.notify({
				state: 'ENEMY_DELETED',
				subject: e.name
			})

			// Save the enemy for later use
			this.deadEnemyList.push( e )

			// And remove them from battle
			const index = this.enemyList.indexOf(e)
			this.enemyList.splice(index, 1, new EmptySpace() )
		}
	}

	private enemyStatusCheck() {

		for (const enemy of this.enemyList ) {
			if ( !( enemy instanceof Enemy ) )
				continue

			if ( enemy.hasStatus('BURNED') ) {
				// Check if has an active status

				if ( (enemy.statusList['BURNED'] as BurnedStatus).isActive ) {
					enemy.recieveDamage(
						(enemy.statusList['BURNED'] as BurnedStatus).burn(), getCore("FIRE") )

					this.notify({
						state: 'BURN_INJURIES',
						subject: enemy.name
					})
				}
				else (enemy.statusList['BURNED'] as BurnedStatus).isActive = true
			}

			enemy.updateStatuses()
		}
	}

	// Based on a float value between 0 and 1 return a random boolean
	private calcRandomBool(float: number) {
		const x = Math.random()
		return x <= float
	}

}