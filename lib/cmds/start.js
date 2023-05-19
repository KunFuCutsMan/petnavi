// Imports and other stuff used
const NFM = require('../utils/NaviFileManager')
const Enquirer = require('enquirer')

// Text
const introText = [
	`
	Welcome to RPG-CLI!
	Lets start by design your own NetNavi`,
	`
	A NetNavi stands for Internet Navigator,
	though since you're interacting via a console interface
	your NetNavi would be a Console Navigator, or a ConNavi...`,
	`
	Lets just stick with "Navi" then.
	I'll give you some questions about your navi:`
]

const coreTypeText = [
	`
	Now, lets give your navi a core type:`,
	`
	A Core Type is what your navi's "Element" is,
	they'll recieve some bonus abilities based on what you choose...`,
	`
	...But they'll be weak to that element's weakness,
	recieving double the damage they would have recieved normally.`,
	`
	Fortunately there the Neutral core exists, though you don't
	get any abilities from it.`
]

const naviFileText = [
	`
	Everything we need to make your own navi is ready`,
	`
	Your navi will be your companion throught this,
	so take care of them!`,
	`
	If your navi loses a match twice, their json file
	will be deleted...`,
	`
	FOREVER`,
	`
	So take care of them, ok? :)`
]

// Module
module.exports = async (args) => {
	// Flag check to see if the text wants to be skipped
	const boolSkipText = (args.s || args.skip)

	const enquirer = new Enquirer()
	enquirer.register('inputAfterText', require('../graphics/enquirer/InputAfterText') )
	enquirer.register('selectAfterText', require('../graphics/enquirer/SelectAfterText') )
	enquirer.register('confirmAfterText', require('../graphics/enquirer/ConfirmAfterText') )

	const answers = await enquirer.prompt([
		{
			type: 'inputaftertext',
			name: 'name',
			message: 'What is the name of your navi?',
			textToShow: (!boolSkipText) ? introText.join('\n') : '',
			result: function(value) {
				value = value.replace(/\s+/gm,'')
				const firstLetter = value.charAt(0).toUpperCase()
				return firstLetter + value.slice(1)
			}
		}, {
			type: 'selectaftertext',
			name: 'core',
			message: 'What is the type or your navi (can be changed later) ?',
			textToShow: (!boolSkipText) ? coreTypeText.join('\n') : '',
			choices: [
				'NEUTRAL', 'FIRE', 'WOOD', 'ELEC', 'WATER',
				'SWORD', 'WIND', 'TARGET', 'BREAK'
			],
				default: 0,
				loop: false,
				pageSize: 9
		}, {
			type: 'confirm',
			name: 'confirm',
			textToShow: (!boolSkipText) ? naviFileText.join('\n') : '',
			message: 'Wish to create your navi file in this directory?'
		}
	])

	// Navi File confirmation
	if (!answers.confirm) {
		console.log('Permission for navi file creation denied')
		process.exit(0)
	}
	
	console.time('Navi File created in')
	await NFM.makeNewNavi(answers.name, 10, answers.core)
	console.timeEnd('Navi File created in')
}