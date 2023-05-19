#!/usr/bin/env node
import minimist from 'minimist'

async function main() {
	const args: minimist.ParsedArgs = minimist(process.argv.slice(2))
	let cmd: String = args._[0]

	if (args.version || args.v)
		cmd = 'version'

	if (args.help || args.h)
		cmd = 'help'
	
	switch (cmd) {
		case 'help':
			require('./cmds/help')(args)
			break
		case 'version':
			require('./cmds/version')(args)
			break
		case 'start':
			require('./cmds/start')(args)
			break
		case 'load':
			require('./cmds/load')(args)
			break
		case 'save':
			require('./cmds/save')(args)
			break
		case 'battle':
			require('./cmds/battle')(args)
			break
		case 'loaded':
			require('./cmds/loaded')(args)
			break
		case 'folder':
			require('./cmds/folder')(args)
			break
		default:
			console.error(`"${cmd}" is not a valid command!`)
			break
	}
}

main()