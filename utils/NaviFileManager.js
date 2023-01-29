// Imports and constants
const fs = require('fs/promises')
const path = require ('path')
const storage = require('node-persist')

// Storage
const STORAGE_SETTINGS = {
	dir: path.resolve(__dirname, '..', 'NaviStorage'),
	stringify: JSON.stringify,
	parse: JSON.parse,
	encoding: 'utf8',
	logging: false,
	ttl: false,
	expiredInterval: 2 * 60 * 1000,
	forgiveParseErrors: true
}

const NAVI_TEMPLATE = {
	"name": 'DefaultNavi.EXE',
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
		"HP30",
		"HP30",
	],
	"willBeDeleted": false,
	"dir": '.',
	"zenny": 100,
	"chipLibrary": []
}

// Navi File Manager (or NFM) is an object containing
// async functions that can be used to read navi files
function NaviFileManager() {

	// Look at the current directory and get the requesten navi json file
	this.readJson = async function(fileName) {
		let str;
		try {
			str = await fs.readFile(
				path.resolve(process.cwd(), fileName),
				(e, d) => d )
		}
		catch (e) {
			console.error('An error occurred whilst making the file:\n'+e)
			process.exit(1)
		}

		return JSON.parse(await str )
	}

	// Make a json file based on the json provided with the name of fileName
	this.makeJson = async function(json, fileName) {
		if ( !fileName.endsWith('.json') ) {
			console.error('Cannot make a "'+fileName+'" file, must be .json')
			process.exit(1)
		}

		const jsonString = JSON.stringify(json, null, '\t')

		await fs.writeFile(
			path.resolve(process.cwd(), fileName),
			jsonString , 'utf8', (e) => {
			if (e) {
				console.error('An error occurred whilst making the file:\n'+e)
				process.exit(1)
			}
		})
	}

	this.deleteJson = async function(filePath) {
		await fs.unlink(filePath)
	}

	// Make a navi file with the name, lvl and core as the arguments
	this.makeNewNavi = async function(name, lvl, core) {
		const hp = lvl * 10
		const cp = lvl * 2

		const navi = new Object( NAVI_TEMPLATE )
		navi.name = name + '.EXE'
		navi.level = lvl
		navi.core = core
		navi.maxHP = hp
		navi.HP = hp
		navi.maxCP = cp
		navi.CP = cp
		navi.willBeDeleted = false
		// The "\\" that appear are actually escaped "\" characters
		navi.dir = path.join( process.cwd(), name + 'DotEXE.json' )


		this.makeJson( navi, name + 'DotEXE.json' )
	}

	// Delete both the navi from storage and its file
	this.deleteNaviWithFile = async function(naviName) {
		const navi = await this.deleteNaviFromStorage(naviName)

		if (navi.dir)
			await this.deleteJson(navi.dir)
		else console.warn("Navi does not have a 'dir' key. Navi was only deleted from storage")
	}

	// Check if the json has the same keys as DEFAULT_NAVI
	this.isNaviJson = function(json) {
		// Key arrays
		let naviTemplateKeys = []
		let jsonKeys = []

		for (const key in NAVI_TEMPLATE)
			naviTemplateKeys.push(key)

		for (const key in json)
			jsonKeys.push(key)

		// Key length must be the same as NAVI_TEMPLATE
		if ( naviTemplateKeys.length !== jsonKeys.length )
			return false

		// Order and name of keys must be the same
		for (let i = 0; i < naviTemplateKeys.length; i++) {
			if (naviTemplateKeys[i] !== jsonKeys[i])
				return false
		}

		return true
	}

	// Load the json into storage, with its key being its 'name'
	this.loadNaviIntoStorage = async function(json) {
		await storage.init(STORAGE_SETTINGS)

		const name = json.name
		await storage.setItem(name, json)
	}

	// Save the info of that navi into Storage
	this.saveNaviFromStorage = async function(naviName) {
		await storage.init(STORAGE_SETTINGS)

		return await storage.getItem(naviName)
	}

	// Update the navi with its current json stats
	this.updateNaviStatsInStorage = async function(naviName, json) {
		await storage.init(STORAGE_SETTINGS)

		await storage.updateItem(naviName, json)
	}

	// Get the navi with said naviName
	this.getNaviFromStorage = async function(naviName) {
		await storage.init(STORAGE_SETTINGS)

		return await storage.getItem(naviName)
	}

	// Remove the navi with said naviName and return its info
	this.deleteNaviFromStorage = async function(naviName) {
		await storage.init(STORAGE_SETTINGS)

		const navi = await storage.getItem(naviName)

		if (navi) {
			await storage.removeItem(naviName)
			return navi
		}
		else return {}
	}
	
	// Get all the navis that end with '.EXE'
	this.getAllLoadedNavis = async function() {
		await storage.init(STORAGE_SETTINGS)

		return await storage.valuesWithKeyMatch('.EXE')
	}

	// Get the navi loaded based on the name, otherwise close the program
	this.getNaviWithName = async function(naviName) {
		const name = naviName ? naviName : ''

		const json = await this.getNaviFromStorage(naviName)
		if ( !json ) {
			console.error('Could not find a Navi with the name "'+naviName+'"')
			process.exit(1)
		}
		else return json
	}
}

module.exports = new NaviFileManager()