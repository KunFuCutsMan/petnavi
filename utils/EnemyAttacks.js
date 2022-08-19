/* Similar to AttackInfo.js, but for attacks used for enemies
An example can be this one:
ShockWave: function() {
		this.name = 'ShockWave' // name of attack
		this.type = 'NEUTRAL' // core type
		this.attackValue = [10] // handled as 'Single' targets from AttackInfo.js
		this.missChance = 20 // Out of 100, because dificulty balancing
	}
*/
let json = {
	ShockWave: function() {
		this.name = 'ShockWave' 
		this.type = 'NEUTRAL'
		this.attackValue = [10]
		this.missChance = 20
	},
	SonicWave: function() {
		this.name = 'SonicWave' 
		this.type = 'NEUTRAL'
		this.attackValue = [80]
		this.missChance = 10
	},
	DynaWave: function() {
		this.name = 'DynaWave' 
		this.type = 'NEUTRAL'
		this.attackValue = [160]
		this.missChance = 10
	},
	WideSword: function() {
		this.name = 'WideSword' 
		this.type = 'SWORD'
		this.attackValue = [30]
		this.missChance = 10
	},
	LongSword: function() {
		this.name = 'LongSword' 
		this.type = 'SWORD'
		this.attackValue = [40]
		this.missChance = 10
	},
	FireSword: function() {
		this.name = 'FireSword' 
		this.type = 'FIRE'
		this.attackValue = [60]
		this.missChance = 10
	},
	FireBlade: function() {
		this.name = 'FireBlade' 
		this.type = 'FIRE'
		this.attackValue = [70]
		this.missChance = 10
	},
	AquaSword: function() {
		this.name = 'AquaSword' 
		this.type = 'AQUA'
		this.attackValue = [100]
		this.missChance = 10
	},
	AquaBlade: function() {
		this.name = 'AquaBlade' 
		this.type = 'AQUA'
		this.attackValue = [110]
		this.missChance = 10
	},
	Quake1: function() {
		this.name = 'Quake1' 
		this.type = 'BREAK'
		this.attackValue = [20]
		this.missChance = 1
	},
	Quake2: function() {
		this.name = 'Quake2' 
		this.type = 'BREAK'
		this.attackValue = [70]
		this.missChance = 1
	},
	Quake3: function() {
		this.name = 'Quake3' 
		this.type = 'BREAK'
		this.attackValue = [150]
		this.missChance = 1
	},
	DashAttack: function() {
		this.name = 'DashAttack' 
		this.type = 'NEUTRAL'
		this.attackValue = [30]
		this.missChance = 30
	},
	BurnDash: function() {
		this.name = 'BurnDash' 
		this.type = 'FIRE'
		this.attackValue = [60]
		this.missChance = 30
	},
	CondorDash: function() {
		this.name = 'CondorDash' 
		this.type = 'WIND'
		this.attackValue = [90]
		this.missChance = 30
	},
	HeatShot: function() {
		this.name = 'HeatShot' 
		this.type = 'FIRE'
		this.attackValue = [30, 5]
		this.missChance = 25
	},
	HeatV: function() {
		this.name = 'HeatV' 
		this.type = 'FIRE'
		this.attackValue = [60, 5, 5]
		this.missChance = 25
	},
	HeatSide: function() {
		this.name = 'HeatSide' 
		this.type = 'FIRE'
		this.attackValue = [90, 5, 5, 5]
		this.missChance = 25
	},
	TriArrow: function() {
		this.name = 'TriArrow' 
		this.type = 'AQUA'
		this.attackValue = [20, 20, 20]
		this.missChance = 20
	},
	TriSpear: function() {
		this.name = 'TriSpear' 
		this.type = 'AQUA'
		this.attackValue = [40, 40, 40]
		this.missChance = 20
	},
	TriLance: function() {
		this.name = 'TriLance' 
		this.type = 'AQUA'
		this.attackValue = [60, 60, 60]
		this.missChance = 20
	},
}

module.exports = function(attk) {
	return new json[attk]()
}
