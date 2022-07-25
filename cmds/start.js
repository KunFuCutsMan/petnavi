const sleep = (ms = 2000) => new Promise( (r) => setTimeout(r, ms) )

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

// Too big to be in inquirer prompts
const coreTypeList = [
	{name: 'Neutral', value: 'NEUTRAL',},
	{name: 'Fire', value: 'FIRE'},
	{name: 'Wood', value: 'WOOD'},
	{name: 'Elec', value: 'ELEC'},
	{name: 'Aqua', value: 'AQUA'},
	{name: 'Sword', value: 'SWORD'},
	{name: 'Wind', value: 'WIND'},
	{name: 'Target', value: 'TARGET'},
	{name: 'Break', value: 'BREAK'}
]

module.exports = async (args, inquirer) => {
	// Flag check to see if the text wants to be skipped
	const boolSkipText = (args.s || args.skip)
	
	// Intro text
	if (!boolSkipText)
		for (const txt of introText) {
			console.log(txt)
			await sleep()
		}

	const answerName = await inquirer.prompt({
		type: 'input',
		name: 'naviName',
		message: 'What is the name of your navi?\n'
		+'( ".exe" will be added to it, no need to write fake extensions )\n'
	})

	// Core Type prompt
	if (!boolSkipText)
		for (const txt of coreTypeText) {
			console.log(txt)
			await sleep()
		}

	const answerCore = await inquirer.prompt({
		type: 'list',
		name: 'coreType',
		message: 'What is the type or your navi?\n'
		+'( Can be changed later )',
		choices: coreTypeList,
		default: 0,
		loop: false,
		pageSize: 9
	})

	// Confirmation about making the navi file on the current directory
	// If falsy then the navi isn't created
	if (!boolSkipText)
		for (const txt of naviFileText) {
			console.log(txt)
			await sleep()
		}

	const answerNaviFile = await inquirer.prompt({
		type: 'confirm',
		name: 'naviFileConfirm',
		message: 'Wish to create your navi file in this directory?'
	})

	// Navi File confirmation
	if (answerNaviFile.naviFileConfirm) {
		console.error('Navi file creation not implemented yet')
	}
	else {
		console.error('Permission for navi file creation denied')
	}
}