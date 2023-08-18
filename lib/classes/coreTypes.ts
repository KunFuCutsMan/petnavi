import { CoreType } from "../types"

export interface Core {
	readonly coreType: CoreType
	readonly status?: string

	isWeakTo( otherCore: Core ): boolean

	isStrongTo( otherCore: Core ): boolean
}

// Neutral Core
export class NeutralCore implements Core {
	coreType: CoreType = "NEUTRAL"
	
	isWeakTo( _otherCore: Core ): boolean {
		return false
	}
	isStrongTo( _otherCore: Core ): boolean {
		return false
	}
}

// Fire Core
export class FireCore implements Core {
	coreType: CoreType = "FIRE"
	status = "BURNED"
	
	isWeakTo( otherCore: Core ): boolean {
		return otherCore.coreType === "AQUA" || otherCore.coreType === "WIND"
	}

	isStrongTo( otherCore: Core ): boolean {
		return otherCore.coreType === "WOOD" || otherCore.coreType === "TARGET"
	}
 }

// Wood Core
export class WoodCore implements Core {
	coreType: CoreType = "WOOD"

	isWeakTo(otherCore: Core): boolean {
		return otherCore.coreType === "FIRE" || otherCore.coreType === "SWORD"
	}

	isStrongTo(otherCore: Core): boolean {
		return otherCore.coreType === "ELEC" || otherCore.coreType === "WIND"
	}
}

// Elec Core
export class ElecCore implements Core {
	coreType: CoreType = "ELEC"
	status = "STUNNED"

	isWeakTo(otherCore: Core): boolean {
		return otherCore.coreType === "WOOD" || otherCore.coreType === "BREAK"
	}

	isStrongTo(otherCore: Core): boolean {
		return otherCore.coreType === "AQUA" || otherCore.coreType === "SWORD"
	}
}

// Water Core
export class AquaCore implements Core {
	coreType: CoreType = "AQUA"

	isWeakTo( otherCore: Core ): boolean {
		return otherCore.coreType === "ELEC" || otherCore.coreType === "TARGET"
	}

	isStrongTo( otherCore: Core ): boolean {
		return otherCore.coreType === "FIRE" || otherCore.coreType === "BREAK"
	}
}

// Sword Core
export class SwordCore implements Core {
	coreType: CoreType = "SWORD"

	isWeakTo(otherCore: Core): boolean {
		return otherCore.coreType === "BREAK" || otherCore.coreType === "ELEC"
	}

	isStrongTo(otherCore: Core): boolean {
		return otherCore.coreType === "WOOD" || otherCore.coreType === "WIND"
	}
}

// Wind Core
export class WindCore implements Core {
	coreType: CoreType = "WIND"

	isWeakTo(otherCore: Core): boolean {
		return otherCore.coreType === "SWORD" || otherCore.coreType === "WOOD"
	}

	isStrongTo(otherCore: Core): boolean {
		return otherCore.coreType === "FIRE" || otherCore.coreType === "TARGET"
	}
}

// Target Core
export class TargetCore implements Core {
	coreType: CoreType = "TARGET"

	isWeakTo( otherCore: Core ): boolean {
		return otherCore.coreType === "WIND" || otherCore.coreType === "FIRE"
	}

	isStrongTo( otherCore: Core ): boolean {
		return otherCore.coreType === "AQUA" || otherCore.coreType === "BREAK"
	}
}

// Break Core
export class BreakCore implements Core {
	coreType: CoreType = "BREAK"

	isWeakTo( otherCore: Core ): boolean {
		return otherCore.coreType === "TARGET" || otherCore.coreType === "AQUA"
	}

	isStrongTo( otherCore: Core ): boolean {
		return otherCore.coreType === "ELEC" || otherCore.coreType === "SWORD"
	}
}

// According to the core type given, return the class described
export function getCore( type: CoreType ): Core {
	switch ( type ) {
		case 'NEUTRAL': return new NeutralCore()
		case 'WOOD': return new WoodCore()
		case 'FIRE': return new FireCore()
		case 'AQUA': return new AquaCore()
		case 'ELEC': return new ElecCore()
		case 'SWORD': return new SwordCore()
		case 'WIND': return new WindCore()
		case 'TARGET': return new TargetCore()
		case 'BREAK': return new BreakCore()
	}
}