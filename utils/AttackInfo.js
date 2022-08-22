/* ATTACK OBJECT FORMAT:
	Sword: {
			// TYPE: Must be one of the 9 core types
			// Indicates the element of the attack
			type: 'NEUTRAL',
			// TARGET: Describes how the damage is dealt, string can be:
			// * 'Single': attackValue affects only the target, attack may happen several times
			// 		if the array has more than one value
			// * 'Triple': attackValue affects the target + whatever may be at its sides
			//		array shows how damage is dealt left to right, target being middle
			// * 'Self': For masochists only (apply as 'Single') target type
			// * 'Heal': What it says on the string
			// * 'Left': Attacks the target + enemy to the left of the target
			// * 'Right': Attacks the target + enemy to the right of target
			// * 'Everyone': Attacks the entire enemy array, handle each target as 'Single' target type
			target: 'Single',
			// * 'React': Will only attack only those enemies who attack first
			// ATTACKVALUE: Array showing what value the attack is made
			// its behavior changes according to how 'target' value is set to
			attackValue: [80]
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
	},
	Vulcan: function() {
		this.name = 'Vulcan'
		this.type = 'NEUTRAL'
		this.cpCost = 6
		this.target = 'Single'
		this.attackValue = [10, 10, 10]
	},
	Sword: function() {
		this.name = 'Sword'
		this.type = 'SWORD'
		this.cpCost = 8
		this.target = 'Single'
		this.attackValue = [80]
	},
	WideSword: function() {
		this.name = 'WideSword'
		this.type = 'SWORD'
		this.cpCost = 8
		this.target = 'Triple'
		this.attackValue = [80, 80, 80]
	},
	Airshot: function() {
		this.name = 'Airshot'
		this.type = 'WIND'
		this.cpCost = 3
		this.target = 'Single'
		this.attackValue = [20]
	},
	HP10: function() {
		this.name = 'HP10'
		this.type = 'NEUTRAL'
		this.cpCost = 3
		this.target = 'Heal'
		this.attackValue = [10]
	},
	Pickaxe: function() {
		this.name = 'Pickaxe'
		this.type = 'NEUTRAL'
		this.cpCost = 4
		this.target = 'Single'
		this.attackValue = [60]
	},
	MetGuard: function() {
		this.name = 'MetGuard'
		this.type = 'NEUTRAL'
		this.cpCost = 3
		this.target = 'React'
		this.attackValue = [50]
	}
}