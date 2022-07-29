// Imports and constants
const fs = require('fs')

const defaultNavi = {
		"name": 'defaultNavi.EXE',
		"level": 10,
		"core": 'NEUTRAL',
		"maxHP": 100,
		"HP": 100,
		"maxCP": 20,
		"CP": 20,
		"CPattacks": [
			"Cannon",
			"Cannon",
			"Vulcan",
			"Vulcan",
			"Sword",
			"WideSword",
			"AirShot",
			"HP10",
			"HP10",
		]
	}

/**
 * readJson(fileName)
 * Looks at the current directory, and searches the requested
 * navi json file, (i.e. "naviManDotEXE.json" for example)
 * @return The file's json
 * */
async function readJson(fileName) {
	if ( !fs.existsSync('./'+fileName) ) {
		console.error('Could not find "'+fileName+'"')
		process.exit(1)
	}

	return JSON.parse( fs.readFileSync('./'+fileName, 'utf8') )
}

/**
 * makeJson(json, filename)
 * Makes a json file based on the object passed to 'json' argument
 * and gives it the name passed down to 'filename'.
 * If an error occurs during this function, the program terminates with an error
 * @err 'filename' doesn't end with '.json'
 * @err Error during creation of file
 * */
async function makeJson(json, fileName) {
	if ( !fileName.endsWith('.json') ) {
		console.error('Cannot make a "'+fileName+'" file, must be .json')
		process.exit(1)
	}

	const jsonString = JSON.stringify(json, null, '\t')

	fs.writeFile('./'+fileName, jsonString , 'utf8', (e) => {
		if (e) {
			console.error('An error occurred whilsy making the file:\n'+e)
			process.exit(1)
		}

		console.log('File created successfully as '+fileName)
	})
}

/**
 * makeNewNavi(naviName, lvl, core)
 * Makes a json file containing data related to a navi
 * including the name, level, and core type of the navi,
 * aswell as adding a default list of chips
 * 
 * After that the file is made using makeJson()
 * */
async function makeNewNavi(naviName, lvl, core) {
	hp = lvl * 10
	cp = lvl * 2

	const navi = new Object( defaultNavi )
	navi.name = naviName + '.EXE'
	navi.level = lvl
	navi.core = core
	navi.maxHP = hp
	navi.hp = hp
	navi.maxCP = cp
	navi.CP = cp

	makeJson( navi, naviName + 'DotEXE.json' )
}

// Navi File Manager (or NFM) is an object containing
// async functions that can be used to read navi files
module.exports = {
	readJson,
	makeJson,
	makeNewNavi
}