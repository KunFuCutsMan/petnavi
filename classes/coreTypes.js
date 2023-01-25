
weaknessChain = {
	'FIRE': ['WATER', 'WIND'],
	'WOOD': ['FIRE', 'SWORD'],
	'ELEC': ['WOOD', 'BREAK'],
	'WATER': ['ELEC', 'TARGET'],
	'SWORD': ['BREAK', 'ELEC'],
	'WIND': ['SWORD', 'WOOD'],
	'TARGET': ['WIND', 'FIRE'],
	'BREAK': ['TARGET', 'WATER']
}

strengthChain = {
	'FIRE': ['WOOD', 'TARGET'],
	'WOOD': ['ELEC', 'WIND'],
	'ELEC': ['WATER', 'SWORD'],
	'WATER': ['FIRE', 'BREAK'],
	'SWORD': ['WOOD', 'WIND'],
	'WIND': ['FIRE', 'TARGET'],
	'TARGET': ['WATER', 'BREAK'],
	'BREAK': ['ELEC', 'SWORD']
}

// Default core class that will never be created, main class that won't be used
// other than here, since its children construct for their own types
class Core {
	constructor( type ) {
		this.type = type
	}

	isWeakTo( OtherCore ) {
		// Neutral Cores don't have weaknesses
		if ( this.type === 'NEUTRAL' || OtherCore.type === 'NEUTRAL' )
			return false

		// Look into the weakness according the hash of weaknesses
		return weaknessChain[ this.type ].includes( OtherCore.type )
	}

	isStrongTo( OtherCore ) {
		// Neutral Cores don't have strengts
		if ( this.type === 'NEUTRAL' || OtherCore.type === 'NEUTRAL' )
			return false

		// Look into the strengths according the hash of strengths
		return strengthChain[ this.type ].includes( OtherCore.type )
	}
}

// Neutral Core
class NeutralCore extends Core { constructor() { super('NEUTRAL') } }

// Fire Core
class FireCore extends Core {constructor() {super('FIRE')} }

// Wood Core
class WoodCore extends Core { constructor() { super('WOOD') } }

// Elec Core
class ElecCore extends Core { constructor() { super('ELEC') } }

// Water Core
class WaterCore extends Core { constructor() { super('WATER') } }

// Sword Core
class SwordCore extends Core { constructor() { super('SWORD') } }

// Wind Core
class WindCore extends Core { constructor() { super('WIND') } }

// Target Core
class TargetCore extends Core { constructor() { super('TARGET') } }

// Break Core
class BreakCore extends Core { constructor() { super('BREAK') } }

// According to the core type given, return the class described
module.exports = function coreTypeClass( type ) {
	switch ( type.toUpperCase() ) {
		case 'NEUTRAL': return NeutralCore
		case 'FIRE': return FireCore
		case 'WOOD': return WoodCore
		case 'WATER': return WaterCore
		case 'ELEC': return ElecCore
		case 'SWORD': return SwordCore
		case 'WindCore': return WindCore
		case 'TARGET': return TargetCore
		case 'BREAK': return BreakCore
	}
}