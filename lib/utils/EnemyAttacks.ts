import { CoreType } from "../types"

export interface EnemyAttack {
	/**
	 * Name and ID of the attack
	 */
	readonly name: string
	/**
	 * Type of core
	 */
	readonly type: CoreType
	/**
	 * Array that shows how much damage is dealt
	 */
	readonly attackValue: number[]
	/**
	 * Float value that represents the chance for an attack to miss
	 */
	readonly missChance: number
}

export function getEnemyAttack( attack: string ) {
	return json[attack]
}

const json: Record<string, EnemyAttack> = {
	ShockWave: {
		name: 'ShockWave',
		type: 'NEUTRAL',
		attackValue: [10],
		missChance: 0.2,
	},
	SonicWave: {
		name: 'SonicWave',
		type: 'NEUTRAL',
		attackValue: [80],
		missChance: 0.1,
	},
	DynaWave: {
		name: 'DynaWave',
		type: 'NEUTRAL',
		attackValue: [160],
		missChance: 0.1,
	},
	WideSword: {
		name: 'WideSword',
		type: 'SWORD',
		attackValue: [30],
		missChance: 0.1,
	},
	LongSword: {
		name: 'LongSword',
		type: 'SWORD',
		attackValue: [40],
		missChance: 0.10,
	},
	FireSword: {
		name: 'FireSword',
		type: 'FIRE',
		attackValue: [60],
		missChance: 0.1,
	},
	FireBlade: {
		name: 'FireBlade',
		type: 'FIRE',
		attackValue: [70],
		missChance: 0.1,
	},
	AquaSword: {
		name: 'AquaSword',
		type: 'AQUA',
		attackValue: [100],
		missChance: 0.1,
	},
	AquaBlade: {
		name: 'AquaBlade',
		type: 'AQUA',
		attackValue: [110],
		missChance: 0.1,
	},
	Quake1: {
		name: 'Quake1',
		type: 'BREAK',
		attackValue: [20],
		missChance: 0.001,
	},
	Quake2: {
		name: 'Quake2',
		type: 'BREAK',
		attackValue: [70],
		missChance: 0.001,
	},
	Quake3: {
		name: 'Quake3',
		type: 'BREAK',
		attackValue: [150],
		missChance: 0.001,
	},
	DashAttack: {
		name: 'DashAttack',
		type: 'NEUTRAL',
		attackValue: [30],
		missChance: 0.30,
	},
	BurnDash: {
		name: 'BurnDash',
		type: 'FIRE',
		attackValue: [60],
		missChance: 0.30,
	},
	CondorDash: {
		name: 'CondorDash',
		type: 'WIND',
		attackValue: [90],
		missChance: 0.30,
	},
	HeatShot: {
		name: 'HeatShot',
		type: 'FIRE',
		attackValue: [30, 5],
		missChance: 0.25,
	},
	HeatV: {
		name: 'HeatV',
		type: 'FIRE',
		attackValue: [60, 5, 5],
		missChance: 0.25,
	},
	HeatSide: {
		name: 'HeatSide',
		type: 'FIRE',
		attackValue: [90, 5, 5, 5],
		missChance: 0.25,
	},
	TriArrow: {
		name: 'TriArrow',
		type: 'AQUA',
		attackValue: [20, 20, 20],
		missChance: 0.5,
	},
	TriSpear: {
		name: 'TriSpear',
		type: 'AQUA',
		attackValue: [40, 40, 40],
		missChance: 0.5,
	},
	TriLance: {
		name: 'TriLance',
		type: 'AQUA',
		attackValue: [60, 60, 60],
		missChance: 0.5,
	},
}
