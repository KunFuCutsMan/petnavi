import { CoreType } from "../types"

export type AttackPattern = string | AttackPattern[]

export interface EnemyData {
	name: string,
	core: CoreType,
	maxHP: number,
	HP: number,
	attacksCP: AttackPattern
	secuence: AttackPattern
	drops: string[]
}

export function getEnemyData( enemyName: string ): EnemyData {
	return info[enemyName]
}

const info: Record<string, EnemyData> = {
	Dummy:  {
		name: 'Dummy',
		core: 'NEUTRAL',
		maxHP: 100,
		HP: 100,
		attacksCP: [ ['Defend', 'Nothing', 'Nothing'] ],
		secuence: [],
		drops: ['Cannon'],
	},
	Mettaur: {
		name: 'Mettaur',
		core: 'NEUTRAL',
		maxHP: 40,
		HP: 40,
		attacksCP: [
			'Nothing',
			[ 'ShockWave', 'Defend' ],
		],
		secuence: [],
		drops: ['ShockWave', 'MetGuard'],
	},
	Mettauros: {
		name: 'Mettauros',
		core: 'NEUTRAL',
		maxHP: 100,
		HP: 100,
		attacksCP: [
			'Defend',
			['SonicWave', 'Defend'],
		],
		secuence: [],
		drops: ['SonicWave', 'MetGuard'],
	},
	Mettaurus: {
		name: 'Mettaurus',
		core: 'NEUTRAL',
		maxHP: 180,
		HP: 180,
		attacksCP: [
			'Defend',
			['DynaWave', 'Defend']
		],
		secuence: [],
		drops: ['DynaWave', 'MetGuard'],
	},
	Swordy: {
		name: 'Swordy',
		core: 'NEUTRAL',
		maxHP: 90,
		HP: 90,
		attacksCP: [
			'Defend',
			'WideSword',
			'LongSword',
		],
		secuence: [],
		drops: ['Sword', 'WideSword'],
	},
	Swordos: {
		name: 'Swordos',
		core: 'FIRE',
		maxHP: 140,
		HP: 140,
		attacksCP: [
			'Defend',
			'FireSword',
			'FireBlade',
		],
		secuence: [],
		drops: ['FireSword', 'FireBlade'],
	},
	Swordres: {
		name: 'Swordres',
		core: 'AQUA',
		maxHP: 220,
		HP: 220,
		attacksCP: [
			'Defend',
			'AquaSword',
			'AquaBlade',
		],
		secuence: [],
		drops: ['AquaSword', 'AquaBlade'],
	},
	Powie: {
		name: 'Powie',
		core: 'BREAK',
		maxHP: 60,
		HP: 60,
		attacksCP: [
			'Defend',
			['Dodge', 'Dodge', 'Quake1'],
		],
		secuence: [],
		drops: ['Quake1'],
	},
	PowOwie: {
		name: 'PowOwie',
		core: 'BREAK',
		maxHP: 140,
		HP: 140,
		attacksCP: [
			'Defend',
			['Dodge', 'Dodge', 'Quake2'],
		],
		secuence: [],
		drops: ['Quake2'],
	},
	PowOwios: {
		name: 'PowOwios',
		core: 'BREAK',
		maxHP: 240,
		HP: 240,
		attacksCP: [
			'Defend',
			['Dodge', 'Dodge', 'Quake3'],
		],
		secuence: [],
		drops: ['Quake3'],
	},
	Fishy: {
		name: 'Fishy',
		core: 'NEUTRAL',
		maxHP: 90,
		HP: 90,
		attacksCP: [
			'Defend',
			['Dodge', 'DashAttack'],
		],
		secuence: [],
		drops: ['DashAttack'],
	},
	Fishi: {
		name: 'Fishi',
		core: 'FIRE',
		maxHP: 150,
		HP: 150,
		attacksCP: [
			'Dodge',
			['Dodge', 'BurnDash'],
		],
		secuence: [],
		drops: ['BurnDash'],
	},
	Fishii: {
		name: 'Fishii',
		core: 'WIND',
		maxHP: 240,
		HP: 240,
		attacksCP: [
			'Dodge',
			['Dodge', 'CondorDash'],
		],
		secuence: [],
		drops: ['CondorDash'],
	},
	Spikey: {
		name: 'Spikey',
		core: 'FIRE',
		maxHP: 90,
		HP: 90,
		attacksCP: [
			'Dodge',
			['Dodge', 'HeatShot'],
		],
		secuence: [],
		drops: ['HeatShot'],
	},
	Spiko: {
		name: 'Spiko',
		core: 'FIRE',
		maxHP: 140,
		HP: 140,
		attacksCP: [
			'Defend',
			'HeatV',
			['Dodge', 'HeatV'],
		],
		secuence: [],
		drops: ['HeatV'],
	},
	Spikus: {
		name: 'Spikus',
		core: 'FIRE',
		maxHP: 190,
		HP: 190,
		attacksCP: [
			'Defend',
			'HeatSide',
			'Dodge',
			['Dodge', 'HeatSide'],
		],
		secuence: [],
		drops: ['HeatSide'],
	},
	Piranha: {
		name: 'Piranha',
		core: 'AQUA',
		maxHP: 70,
		HP: 70,
		attacksCP: [
			'Dodge',
			['Nothing', 'TriArrow'],
		],
		secuence: [],
		drops: ['TriArrow'],
	},
	Piranhas: {
		name: 'Piranhas',
		core: 'AQUA',
		maxHP: 120,
		HP: 120,
		attacksCP: [
			'Dodge',
			['Nothing', 'TriSpear'],
		],
		secuence: [],
		drops: ['TriSpear'],
	},
	Piranhar: {
		name: 'Piranhar',
		core: 'AQUA',
		maxHP: 150,
		HP: 150,
		attacksCP: [
			'Dodge',
			['Dodge', 'TriLance'],
		],
		secuence: [],
		drops: ['TriLance'],
	}
}
