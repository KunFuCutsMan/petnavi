const cmd = 'rpg-cli'

const menus = {
	main: `
	${cmd} [command] <options>

	-v or version ...... Show package version
	-h or help ......... Show help menu for a command
	ping ............... Replies with "Pong!"
	start .............. Start your adventure by making your own navi
	load ............... Load your navi into the module`,
	ping: `
	${cmd} ping

	Replies with "Pong!"
	Not much else is going on.`,
	start: `
	${cmd} start <args>

	Start your adventure by making your own navi.
	
	After your navi is created, its information will be
	stored in a .json format.

	Most commands will require you to be in the same to
	have this navi file loaded, so remember where you save it

	DO NOT MODIFY THIS JSON, otherwise you will be very uncool :(

	FLAGS:
	-s or --skip
		Skip the dialog and go straight into the questions`,
	load: `
	${cmd} load <fileName>

	Load your navi into the module

	By default, a prompt will show up asking for the file name
	you wish to load, after of which your navi will be used by
	the module for other commands or activities (like battling).

	Most actions that happen to your navi through these commands
	will be applied to the loaded copy of your navi, after of which
	you will save your progress via the 'save' command.

	If an '-n' or '--name' flag is provided, said filename will
	be loaded without the prompt showing up.

	ARGUMENTS:
	<fileName> ......... File name of navi`
}

module.exports = (args) => {
	const subCmd = args._[0] === 'help'
		? args._[1]
		: args._[0]

	console.log(menus[subCmd] || menus.main)
}