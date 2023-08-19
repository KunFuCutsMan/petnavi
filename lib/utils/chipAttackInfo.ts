import { CoreType } from "../types"

export type ChipAttackTarget =
	"SINGLE"
	| "TRIPLE"
	| "SELF"
	| "HEAL"
	| "LEFT"
	| "RIGHT"
	| "LOW"
	| "HIGH"
	| "EVERYONE"
	| "REACT"

export interface ChipAttack {
	/**
	 * Name and ID of the attack
	 */
	readonly name: string,
	/**
	 * Cyber Points required to do the attack
	 */
	readonly cpCost: number,
	/**
	 * Type of core
	 */
	readonly type: CoreType,
	/**
	 * Type of attacking:
	 * 
	 * * **SINGLE:** ``attackValue`` affects only the target. Attack may happen several times,
	 * if the array has more than one value.
	 * 
	 * * **TRIPLE:** ``attackValue`` affects the target + whatever may be at its sides.
	 * Array shows how damage is dealt left to right, target being in the middle.
	 * 
	 * * **SELF:** For masochists only. (Apply as SINGLE target type)
	 * 
	 * * **HEAL:** Heal the user.
	 * 
	 * * **LEFT:** Attack the target and the enemy on its left
	 * 
	 * * **RIGHT:** Attack the target and the enemy on its right
	 * 
	 * * **LOW:** Attack the target and the enemy next to it who has the lowest HP
	 * 
	 * * **HIGH:** Attack the target and the enemy next to it who has the highest HP
	 * 
	 * * **EVERYONE:** Attacks the entire enemy array, handle each target as SINGLE target type
	 * 
	 * * **REACT:** Attack only those enemies who attack first
	 */
	readonly target: ChipAttackTarget,
	/**
	 * Array that shows how much damage is dealt. Behavior changes according to ``target``
	 */
	readonly attackValue: Array<number>,
	/**
	 * What it says, useful for UI stuff
	 */
	readonly canTarget: boolean,
}

export function getChipInfo(chip: string): ChipAttack {
	return info[chip]
}

const info: Record<string, ChipAttack> = {
	Cannon: {
		name: 'Cannon',
		type: 'NEUTRAL',
		cpCost: 3,
		target: 'SINGLE',
		attackValue: [40],
		canTarget: true,
	},
	Vulcan: {
		name: 'Vulcan',
		type: 'NEUTRAL',
		cpCost: 6,
		target: 'SINGLE',
		attackValue: [10, 10, 10],
		canTarget: true,
	},
	Sword: {
		name: 'Sword',
		type: 'SWORD',
		cpCost: 8,
		target: 'SINGLE',
		attackValue: [80],
		canTarget: true,
	},
	WideSword: {
		name: 'WideSword',
		type: 'SWORD',
		cpCost: 8,
		target: 'TRIPLE',
		attackValue: [80, 80, 80],
		canTarget: true,
	},
	AirShot: {
		name: 'AirShot',
		type: 'WIND',
		cpCost: 3,
		target: 'SINGLE',
		attackValue: [20],
		canTarget: true,
	},
	HP30: {
		name: 'HP30',
		type: 'NEUTRAL',
		cpCost: 3,
		target: 'HEAL',
		attackValue: [30],
		canTarget: false,
	},
	ShockWave: {
		name: 'ShockWave',
		type: 'NEUTRAL',
		cpCost: 4,
		target: 'SINGLE',
		attackValue: [60],
		canTarget: true,
	},
	SonicWave: {
		name: 'SonicWave',
		type: 'NEUTRAL',
		cpCost: 4,
		target: 'SINGLE',
		attackValue: [100],
		canTarget: true,
	},
	DynaWave: {
		name: 'DynaWave',
		type: 'NEUTRAL',
		cpCost: 4,
		target: 'SINGLE',
		attackValue: [140],
		canTarget: true,
	},
	MetGuard: {
		name: 'MetGuard',
		type: 'NEUTRAL',
		cpCost: 3,
		target: 'REACT',
		attackValue: [50],
		canTarget: false,
	},
	FireSword: {
		name: 'FireSword',
		type: 'FIRE',
		cpCost: 10,
		target: 'HIGH',
		attackValue: [100, 100],
		canTarget: true,
	},
	FireBlade: {
		name: 'FireBlade',
		type: 'FIRE',
		cpCost: 10,
		target: 'LOW',
		attackValue: [100, 100],
		canTarget: true,
	},
	AquaSword: {
		name: 'AquaSword',
		type: 'AQUA',
		cpCost: 12,
		target: 'HIGH',
		attackValue: [120, 120],
		canTarget: true,
	},
	AquaBlade: {
		name: 'AquaBlade',
		type: 'AQUA',
		cpCost: 12,
		target: 'LOW',
		attackValue: [120, 120],
		canTarget: true,
	},
	Quake1: {
		name: 'Quake1',
		type: 'BREAK',
		cpCost: 10,
		target: 'SINGLE',
		attackValue: [100],
		canTarget: true,
	},
	Quake2: {
		name: 'Quake2',
		type: 'BREAK',
		cpCost: 16,
		target: 'SINGLE',
		attackValue: [180],
		canTarget: true,
	},
	Quake3: {
		name: 'Quake3',
		type: 'BREAK',
		cpCost: 20,
		target: 'SINGLE',
		attackValue: [250],
		canTarget: true,
	},
	DashAttack: {
		name: 'DashAttack',
		type: 'NEUTRAL',
		cpCost: 6,
		target: 'SINGLE',
		attackValue: [90],
		canTarget: true,
	},
	BurnDash: {
		name: 'BurnDash',
		type: 'FIRE',
		cpCost: 9,
		target: 'SINGLE',
		attackValue: [120],
		canTarget: true,
	},
	CondorDash: {
		name: 'CondorDash',
		type: 'WIND',
		cpCost: 14,
		target: 'SINGLE',
		attackValue: [180],
		canTarget: true,
	},
	HeatShot: {
		name: 'HeatShot',
		type: 'FIRE',
		cpCost: 6,
		target: 'SINGLE',
		attackValue: [40, 5],
		canTarget: true,
	},
	HeatV: {
		name: 'HeatV',
		type: 'FIRE',
		cpCost: 9,
		target: 'LOW',
		attackValue: [50, 15],
		canTarget: true,
	},
	HeatSide: {
		name: 'HeatSide',
		type: 'FIRE',
		cpCost: 12,
		target: 'TRIPLE',
		attackValue: [20, 60, 20],
		canTarget: true,
	},
	TriArrow: {
		name: 'TriArrow',
		type: 'AQUA',
		cpCost: 9,
		target: 'SINGLE',
		attackValue: [30, 30, 30],
		canTarget: true,
	},
	TriSpear: {
		name: 'TriSpear',
		type: 'AQUA',
		cpCost: 14,
		target: 'SINGLE',
		attackValue: [40, 40, 40, 40],
		canTarget: true,
	},
	TriLance: {
		name: 'TriLance',
		type: 'AQUA',
		cpCost: 18,
		target: 'SINGLE',
		attackValue: [50, 50, 50, 50, 50],
		canTarget: true,
	}
}