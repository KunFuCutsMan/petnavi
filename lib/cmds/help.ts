import minimist from "minimist"

const main: String = `
	petnavi [command] <args>

	-v or version ...... Show package version
	-h or help ......... Show help menu for a command
	start .............. Start your adventure by making your own navi
	load ............... Load your navi into the module
	save ............... Save your navi into a file
	battle ............. Do a battle!
	loaded ............. Show the current loaded navis

	COMMON ARGUMENTS:
	<fileName> ......... File name of navi (i.e. "DefaultNaviDotEXE.json")
	<naviName> ......... Navi's name (with .EXE suffix)`
	
const start: String = `
	petnavi start [flags]

	Start your adventure by making your own navi.
	
	After your navi is created, its information will be
	stored in a .json format.

	Most commands will require you to be in the same to
	have this navi file loaded, so remember where you save it

	DO NOT MODIFY THIS JSON, otherwise you will be very uncool :(

	FLAGS:
	-s or --skip
		Skip the dialog and go straight into the questions`

const load: String = `
	petnavi load <fileName>

	Load your navi into the module

	Whatever file that is provided in <fileName> will be loaded
	and used other commands or other activities like battling
	(after checking it's an actual Navi File, of course)

	Most actions that happen to your navi through these commands
	will be applied to the loaded copy of your navi, after of which
	you will save your progress via the 'save' command.

	ARGUMENTS:
	<fileName> ......... File name of navi (i.e. "DefaultNaviDotEXE.json")`

const save: String = `
	petnavi save <naviName>
	
	Save your navi into a file

	If your navi was previously loaded into the module, it will be
	saved into a json file similar to the one created via the 'start'
	command, but now with stats reflecting any changes the navi had.

	Your navi's name is provided in <naviName> and is what is used to
	get access to your navi's information. Remember your navi's name
	includes a ".EXE" suffix aswell, so be sure to add that

	ARGUMENTS:
	<naviName> ......... Navi's name (with .EXE suffix)`

const battle: String = `
	petnavi battle <naviName>

	Do a battle!

	Prototype command for starting a battle, use one loaded navi
	to battle a randomly generated battle agaisnt 3 enemies.

	On your turn, you can do one of 4 actions:
	- Attack with your buster ( only deal 10 NEUTRAL type damage )
	- Use a Cyber Chip ( if you have enough CP to use it )
	- Defend agaisnt incoming attacks ( and recover some of your CP )
	- Escape the battle

	After you decide what to do, its the enemies's turn!
	Each enemy has its own patterns and guidelines for attacking you,
	while others will attack with no discernable pattern.

	ARGUMENTS:
	<naviName> ......... Navi's name (with .EXE suffix)`

const loaded: String = `
	petnavi loaded

	Show the current loaded navis

	And does so with a neat navi card :)`

export default async function help(args: minimist.ParsedArgs) {

	type commandNames = "main" | "start" | "load" | "save" | "battle" | "loaded"

	const subCmd: String = args._[0] == "help"
		? args._[1] : args._[0]

	const commandList: Record<commandNames, String>  = {
		"main": main,
		"start": start,
		"load": load,
		"save": save,
		"battle": battle,
		"loaded": loaded
	}

	console.log( commandList[subCmd as commandNames] || commandList.main )
}