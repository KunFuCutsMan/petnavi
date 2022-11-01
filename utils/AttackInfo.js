/* ATTACK OBJECT FORMAT:
	Sword: {
		TYPE: Must be one of the 9 core types
		* Indicates the element of the attack
		TARGET: Describes how the damage is dealt, string can be:
		* 'Single': attackValue affects only the target, attack may happen several times
			if the array has more than one value
		* 'Triple': attackValue affects the target + whatever may be at its sides
			array shows how damage is dealt left to right, target being middle
		* 'Self': For masochists only (apply as 'Single') target type
		* 'Heal': What it says on the string
		* 'Low': Attacks the target + enemy to the left of the target
		* 'Right': Attacks the target + enemy to the right of target
		* 'High': Attacks target + enemy next to it with higher hp
		* 'Low': Attacks target + enemy next to it with lower hp
		* 'Everyone': Attacks the entire enemy array, handle each target as 'Single' target type
		* 'React': Will only attack only those enemies who attack first
		ATTACKVALUE: Array showing what value the attack is made
		* its behavior changes according to how 'target' value is set to
		CANTARGET: Boolean that does what it says, used for UI stuff
	}
*/

module.exports = function(chip) {
	return new json[chip]()
}

var json = {
	Cannon: function() {
		this.name = 'Cannon'
		this.type = 'NEUTRAL'
		this.cpCost = 3
		this.target = 'Single'
		this.attackValue = [40]
		this.canTarget = true
	},
	Vulcan: function() {
		this.name = 'Vulcan'
		this.type = 'NEUTRAL'
		this.cpCost = 6
		this.target = 'Single'
		this.attackValue = [10, 10, 10]
		this.canTarget = true
	},
	Sword: function() {
		this.name = 'Sword'
		this.type = 'SWORD'
		this.cpCost = 8
		this.target = 'Single'
		this.attackValue = [80]
		this.canTarget = true
	},
	WideSword: function() {
		this.name = 'WideSword'
		this.type = 'SWORD'
		this.cpCost = 8
		this.target = 'Triple'
		this.attackValue = [80, 80, 80]
		this.canTarget = true
	},
	AirShot: function() {
		this.name = 'AirShot'
		this.type = 'WIND'
		this.cpCost = 3
		this.target = 'Single'
		this.attackValue = [20]
		this.canTarget = true
	},
	HP30: function() {
		this.name = 'HP10'
		this.type = 'NEUTRAL'
		this.cpCost = 3
		this.target = 'Heal'
		this.attackValue = [30]
		this.canTarget = false
	},
	ShockWave: function() {
		this.name = 'ShockWave'
		this.type = 'NEUTRAL'
		this.cpCost = 4
		this.target = 'Single'
		this.attackValue = [60]
		this.canTarget = true
	},
	SonicWave: function() {
		this.name = 'SonicWave'
		this.type = 'NEUTRAL'
		this.cpCost = 4
		this.target = 'Single'
		this.attackValue = [100]
		this.canTarget = true
	},
	DynaWave: function() {
		this.name = 'DynaWave'
		this.type = 'NEUTRAL'
		this.cpCost = 4
		this.target = 'Single'
		this.attackValue = [140]
		this.canTarget = true
	},
	MetGuard: function() {
		this.name = 'MetGuard'
		this.type = 'NEUTRAL'
		this.cpCost = 3
		this.target = 'React'
		this.attackValue = [50]
		this.canTarget = false
	},
	FireSword: function() {
		this.name = 'FireSword'
		this.type = 'FIRE'
		this.cpCost = 10
		this.target = 'High'
		this.attackValue = [100, 100]
		this.canTarget = true
	},
	FireBlade: function() {
		this.name = 'FireBlade'
		this.type = 'FIRE'
		this.cpCost = 10
		this.target = 'Low'
		this.attackValue = [100, 100]
		this.canTarget = true
	},
	AquaSword: function() {
		this.name = 'AquaSword'
		this.type = 'AQUA'
		this.cpCost = 12
		this.target = 'High'
		this.attackValue = [120, 120]
		this.canTarget = true
	},
	AquaBlade: function() {
		this.name = 'AquaBlade'
		this.type = 'AQUA'
		this.cpCost = 12
		this.target = 'Low'
		this.attackValue = [120, 120]
		this.canTarget = true
	},
	Quake1: function() {
		this.name = 'Quake1'
		this.type = 'BREAK'
		this.cpCost = 10
		this.target = 'Single'
		this.attackValue = [100]
		this.canTarget = true
	},
	Quake2: function() {
		this.name = 'Quake2'
		this.type = 'BREAK'
		this.cpCost = 16
		this.target = 'Single'
		this.attackValue = [180]
		this.canTarget = true
	},
	Quake3: function() {
		this.name = 'Quake3'
		this.type = 'BREAK'
		this.cpCost = 20
		this.target = 'Single'
		this.attackValue = [250]
		this.canTarget = true
	},
	DashAttack: function() {
		this.name = 'DashAttack'
		this.type = 'NEUTRAL'
		this.cpCost = 6
		this.target = 'Single'
		this.attackValue = [90]
		this.canTarget = true
	},
	BurnDash: function() {
		this.name = 'BurnDash'
		this.type = 'FIRE'
		this.cpCost = 9
		this.target = 'Single'
		this.attackValue = [120]
		this.canTarget = true
	},
	CondorDash: function() {
		this.name = 'CondorDash'
		this.type = 'WIND'
		this.cpCost = 14
		this.target = 'Single'
		this.attackValue = [180]
		this.canTarget = true
	},
	HeatShot: function() {
		this.name = 'HeatShot'
		this.type = 'FIRE'
		this.cpCost = 6
		this.target = 'Single'
		this.attackValue = [40, 5]
		this.canTarget = true
	},
	HeatV: function() {
		this.name = 'HeatV'
		this.type = 'FIRE'
		this.cpCost = 9
		this.target = 'Low'
		this.attackValue = [50, 15]
		this.canTarget = true
	},
	HeatSide: function() {
		this.name = 'HeatSide'
		this.type = 'FIRE'
		this.cpCost = 12
		this.target = 'Triple'
		this.attackValue = [20, 60, 20]
		this.canTarget = true
	},
	TriArrow: function() {
		this.name = 'TriArrow'
		this.type = 'AQUA'
		this.cpCost = 9
		this.target = 'Single'
		this.attackValue = [30, 30, 30]
		this.canTarget = true
	},
	TriSpear: function() {
		this.name = 'TriSpear'
		this.type = 'AQUA'
		this.cpCost = 14
		this.target = 'Single'
		this.attackValue = [40, 40, 40, 40]
		this.canTarget = true
	},
	TriLance: function() {
		this.name = 'TriLance'
		this.type = 'AQUA'
		this.cpCost = 18
		this.target = 'Single'
		this.attackValue = [50, 50, 50, 50, 50]
		this.canTarget = true
	}
}