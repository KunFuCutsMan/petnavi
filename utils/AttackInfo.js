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
			// * 'Self': For masochists only, or status effects
			// * 'Column': Attacks the target's lane, attackValue shows how damage is dealt
			// * 	front to back
			target: 'Single',
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
		this.type = 'NEUTRAL'
		this.cpCost = 5
		this.target = 'Single'
		this.attackValue = [40]
	},
	Vulcan: function() {
		this.type: 'NEUTRAL'
		this.cpCost = 6
		this.target = 'Single'
		this.attackValue = [10, 10, 10]
	},
	Sword: function() {
		this.type = 'SWORD',
		this.cpCost = 8,
		this.target = 'Single',
		this.attackValue = [80]
	},
	WideSword: function() {
		this.type = 'SWORD'
		this.cpCost = 8
		this.target = 'Triple'
		this.attackValue = [80, 80, 80]
	},
	Airshot: function() {
		this.type = 'WIND'
		this.cpCost = 3
		this.target = 'Single'
		this.attackValue = [20]
	},
	HP10: function() {
		this.type: 'NEUTRAL'
		this.cpCost: 3
		this.target: 'Self'
		this.attackValue: [80]
	},
	Pickaxe: function() {
		this.type: 'NEUTRAL'
		this.cpCost: 3
		this.target: 'Column'
		this.attackValue: [60]
	},
	MetGuard: function() {
		this.type = 'NEUTRAL'
		this.cpCost = 3
		this.target = 'Column'
		this.attackValue = [50]
	}
}