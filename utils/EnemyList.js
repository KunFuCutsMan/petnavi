const json = {
	Mettaur: {
		name: 'Mettaur', 
		core: 'NEUTRAL',
		maxHP: 40,
		HP: 40,
		CPattacks: [
		'PickAxe',
		[ 'PickAxe', 'Defend' ]
		]
	}
}

module.exports = new Object(json)