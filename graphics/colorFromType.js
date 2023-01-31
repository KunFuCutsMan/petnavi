const c = require('ansi-colors')

module.exports = function( type ) {

	switch ( type.toUpperCase() ) {
		case 'NEUTRAL': return c.bold.white
		case 'FIRE': return c.red
		case 'WOOD': return c.green
		case 'WATER': return c.blue
		case 'ELEC': return c.bold.yellow
		case 'SWORD': return c.cyan
		case 'WIND': return c.gray
		case 'TARGET': return c.yellow
		case 'BREAK': return c.dim.gray
	}
}