// Whenever the function is called, it will give an enemy
// via the use of its constructor
module.exports = function(enemy) {
	return new json[enemy]()
}

var json = {
	Mettaur: function() {
		this.name = 'Mettaur'
		this.core = 'NEUTRAL'
		this.maxHP = 40
		this.HP = 40
		this.CPattacks = [
		'PickAxe',
		[ 'PickAxe', 'Defend' ]
		]
	}
}
