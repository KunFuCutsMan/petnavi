import c from "ansi-colors";
import { CoreType } from "../types";

export function getColorFromColorType( type: CoreType ): c.StyleFunction {

	switch ( type ) {
		case 'NEUTRAL': return c.bold.white
		case 'FIRE': return c.red
		case 'WOOD': return c.green
		case 'AQUA': return c.blue
		case 'ELEC': return c.bold.yellow
		case 'SWORD': return c.cyan
		case 'WIND': return c.gray
		case 'TARGET': return c.yellow
		case 'BREAK': return c.dim.gray
	}
}