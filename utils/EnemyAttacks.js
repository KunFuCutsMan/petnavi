/* Similar to AttackInfo.js, but for attacks used for enemies
An example can be this one:
PickAxe: function() {
		this.name = 'Pickaxe' // name of attack
		this.type = 'NEUTRAL' // core type
		this.attackValue = [10] // handled as 'Single' targets from AttackInfo.js
		this.missChance = 20 // Out of 100, because dificulty balancing
	}
*/
let json = {
	PickAxe: function() {
		this.name = 'PickAxe' 
		this.type = 'NEUTRAL'
		this.attackValue = [10]
		this.missChance = 20
	}
}

module.exports = function(attk) {
	return new json[attk]()
}
