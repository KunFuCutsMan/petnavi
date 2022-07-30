#!/usr/bin/env node
const minimist = require('minimist')

async function main() {
	const args = minimist(process.argv.slice(2))
	let cmd = args._[0]

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
		case 'ping':
			require('./cmds/ping')(args)
			break
		case 'start':
			require('./cmds/start')(args)
			break
		default:
			console.error(`"${cmd}" is not a valid command!`)
			break
	}
}

main()