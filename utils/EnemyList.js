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
			'Nothing',
			[ 'ShockWave', 'Defend' ]
		]
		this.secuence = []
	},
	Mettauros: function() {
		this.name = 'Mettauros'
		this.core = 'NEUTRAL'
		this.maxHP = 100
		this.HP = 100
		this.CPattacks = [
			'Defend',
			['SonicWave', 'Defend'],
		]
		this.secuence = []
	},
	Mettaurus: function() {
		this.name = 'Mettaurus'
		this.core = 'NEUTRAL'
		this.maxHP = 180
		this.HP = 180
		this.CPattacks = [
			'Defend',
			['DynaWave', 'Defend']
		]
		this.secuence = []
	},
	Swordy: function() {
		this.name = 'Swordy'
		this.core = 'NEUTRAL'
		this.maxHP = 90
		this.HP = 90
		this.CPattacks = [
			'Defend',
			'WideSword',
			'LongSword'
		]
		this.secuence = []
	},
	Swordos: function() {
		this.name = 'Swordos'
		this.core = 'FIRE'
		this.maxHP = 140
		this.HP = 140
		this.CPattacks = [
			'Defend',
			'FireSword',
			'FireBlade'
		]
		this.secuence = []
	},
	Swordres: function() {
		this.name = 'Swordres'
		this.core = 'AQUA'
		this.maxHP = 220
		this.HP = 220
		this.CPattacks = [
			'Defend',
			'AquaSword',
			'AquaBlade'
		]
		this.secuence = []
	},
	Powie: function() {
		this.name = 'Powie'
		this.core = 'BREAK'
		this.maxHP = 60
		this.HP = 60
		this.CPattacks = [
			'Defend',
			['Dodge', 'Dodge', 'Quake1']
		]
		this.secuence = []
	},
	PowOwie: function() {
		this.name = 'PowOwie'
		this.core = 'BREAK'
		this.maxHP = 140
		this.HP = 140
		this.CPattacks = [
			'Defend',
			['Dodge', 'Dodge', 'Quake2']
		]
		this.secuence = []
	},
	PowOwios: function() {
		this.name = 'PowOwios'
		this.core = 'BREAK'
		this.maxHP = 240
		this.HP = 240
		this.CPattacks = [
			'Defend',
			['Dodge', 'Dodge', 'Quake3']
		]
		this.secuence = []
	},
	Fishy: function() {
		this.name = 'Fishy'
		this.core = 'NEUTRAL'
		this.maxHP = 90
		this.HP = 90
		this.CPattacks = [
			'Defend',
			['Dodge', 'DashAttack']
		]
		this.secuence = []
	},
	Fishi: function() {
		this.name = 'Fishi'
		this.core = 'FIRE'
		this.maxHP = 150
		this.HP = 150
		this.CPattacks = [
			'Dodge',
			['Dodge', 'BurnDash']
		]
		this.secuence = []
	},
	Fishii: function() {
		this.name = 'Fishii'
		this.core = 'WIND'
		this.maxHP = 240
		this.HP = 240
		this.CPattacks = [
			'Dodge',
			['Dodge', 'CondorDash']
		]
		this.secuence = []
	},
	Spikey: function() {
		this.name = 'Spikey'
		this.core = 'FIRE'
		this.maxHP = 90
		this.HP = 90
		this.CPattacks = [
			'Dodge',
			['Dodge', 'HeatShot']
		]
		this.secuence = []
	},
	Spiko: function() {
		this.name = 'Spiko'
		this.core = 'FIRE'
		this.maxHP = 140
		this.HP = 140
		this.CPattacks = [
			'Defend',
			'HeatV',
			['Dodge', 'HeatV']
		]
		this.secuence = []
	},
	Spikus: function() {
		this.name = 'Spikus'
		this.core = 'FIRE'
		this.maxHP = 190
		this.HP = 190
		this.CPattacks = [
			'Defend',
			'HeatSide',
			'Dodge',
			['Dodge', 'HeatSide']
		]
		this.secuence = []
	},
	Piranha: function() {
		this.name = 'Piranha'
		this.core = 'AQUA'
		this.maxHP = 70
		this.HP = 70
		this.CPattacks = [
			'Dodge',
			['Nothing', 'TriArrow']
		]
		this.secuence = []
	},
	Piranhas: function() {
		this.name = 'Piranhas'
		this.core = 'AQUA'
		this.maxHP = 120
		this.HP = 120
		this.CPattacks = [
			'Dodge',
			['Nothing', 'TriSpear']
		]
		this.secuence = []
	},
	Piranhar: function() {
		this.name = 'Piranhar'
		this.core = 'AQUA'
		this.maxHP = 150
		this.HP = 150
		this.CPattacks = [
			'Dodge',
			['Dodge', 'TriLance']
		]
		this.secuence = []
	}
}
