// Imports and other stuff used
const NFM = require('../utils/NaviFileManager')
const inquirer = require('inquirer')

// Module
module.exports = async (args) => {
	
	const fileName = args._[1]
		? args._[1]
		: ''

	const json = await NFM.readJson(fileName)
	
	if ( NFM.isNaviJson(json) ) {
		await NFM.loadNaviIntoStorage(json)
		console.log('Navi Loaded!')
	}
	else console.warn('File is not a navi json')
}