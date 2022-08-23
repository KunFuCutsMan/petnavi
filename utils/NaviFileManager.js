// Imports and constants
const fs = require('fs')
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
	]
}

/**
 * isNaviJson(json)
 * Checks if the json provided has the same layout
 * as NAVI_TEMPLATE, checking order and length of the keys
 * of the json provided
 * */
function isNaviJson(json) {
	// Key arrays
	let NaviTemplateKeys = []
	let jsonKeys = []

	for (const key in NAVI_TEMPLATE)
		NaviTemplateKeys.push(key)

	for (const key in json)
		jsonKeys.push(key)

	// Key length must be the same as NAVI_TEMPLATE
	if ( NaviTemplateKeys.length !== jsonKeys.length )
		return false

	// Order and name of keys must be the same
	for (let i = 0; i < NaviTemplateKeys.length; i++) {
		if (NaviTemplateKeys[i] !== jsonKeys[i])
			return false
	}

	return true
}

/**
 * loadNaviIntoStorage(json)
 * Using node-persists, loads the navi into local storage
 * Using the navi's name (i.e. 'DefaultNavi.EXE') as its key
 * */
async function loadNaviIntoStorage(json) {
	await storage.init(STORAGE_SETTINGS)

	const name = json.name
	await storage.setItem(name, json)
}

/**
 * saveNaviFromStorage(naviName)
 * Gets the navi from '/NaviStorage' with the name of the navi
 * (i.e. "DefaultNavi.EXE") and saves that navi with its
 * appropiate name
 * */
async function saveNaviFromStorage(naviName) {
	await storage.init(STORAGE_SETTINGS)

	return await storage.getItem(naviName)
}

/**
 * updateNaviStatsInStorage(naviName, json)
 * Updates the current navi provided in 'naviName' to the
 * json provided in 'json'
 * */
async function updateNaviStatsInStorage(naviName, json) {
	await storage.init(STORAGE_SETTINGS)

	await storage.updateItem(naviName, json)
}

/**
 * getNaviFromStorage(naviName)
 * Gets the current navi loaded in the storage
 * */
async function getNaviFromStorage(naviName) {
	await storage.init(STORAGE_SETTINGS)

	return await storage.getItem(naviName)
}

/** 
 * getAllLoadedNavis()
 * Returns all the loaded Navis
 * */
async function getAllLoadedNavis() {
	await storage.init(STORAGE_SETTINGS)

	return await storage.valuesWithKeyMatch('.EXE')
}

/**
 * getNaviCard(navi)
 * Returns a card showing the navi's stats
 * */
function getNaviCard(navi) {
	// Get the navi's CPattacks arranged neatly
	// Into lines of 5
	let i = 0
	let lines = ``

	while (i < navi.CPattacks.length) {
		if (i % 5 == 0)
			lines += `
	${navi.CPattacks[i]} `
		
		else lines += `${navi.CPattacks[i]} `
		
		i++
	}

	// Actual card
	return `
	==================================================
	Name: ${navi.name}	${navi.core} CORE
	Level: ${navi.level}

	HP: ${navi.maxHP} / ${navi.HP}	CP: ${navi.maxCP} / ${navi.CP}
	Current Chips:
	${lines}
	==================================================`
}

/**
 * readJson(fileName)
 * Looks at the current directory, and searches the requested
 * navi json file, (i.e. "naviManDotEXE.json" for example)
 * @return The file's json
 * */
async function readJson(fileName) {
	try {
		const str = fs.readFileSync(path.resolve(process.cwd(), fileName), 'utf8')
		return JSON.parse( str )
	}
	catch (e) {
		console.error('An error occurred whilst reading the file:\n'+e)
		process.exit(1)
	}
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

	fs.writeFile(path.resolve(process.cwd(), fileName), jsonString , 'utf8', (e) => {
		if (e) {
			console.error('An error occurred whilst making the file:\n'+e)
			process.exit(1)
		}
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
async function makeNewNavi(name, lvl, core) {
	hp = lvl * 10
	cp = lvl * 2

	const navi = new Object( NAVI_TEMPLATE )
	navi.name = name + '.EXE'
	navi.level = lvl
	navi.core = core
	navi.maxHP = hp
	navi.HP = hp
	navi.maxCP = cp
	navi.CP = cp

	makeJson( navi, name + 'DotEXE.json' )
}

// Navi File Manager (or NFM) is an object containing
// async functions that can be used to read navi files
function NaviFileManager() {
	this.readJson = readJson
	this.makeJson = makeJson
	this.makeNewNavi = makeNewNavi
	this.isNaviJson = isNaviJson
	this.loadNaviIntoStorage = loadNaviIntoStorage
	this.saveNaviFromStorage = saveNaviFromStorage
	this.updateNaviStatsInStorage = updateNaviStatsInStorage
	this.getNaviFromStorage = getNaviFromStorage
	this.getAllLoadedNavis = getAllLoadedNavis
	this.getNaviCard = getNaviCard
}
module.exports = new NaviFileManager()