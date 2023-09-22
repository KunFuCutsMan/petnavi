#!/usr/bin/env node
import minimist from 'minimist'
import help from "./cmds/help"
import version from './cmds/version'
import start from './cmds/start'
import load from './cmds/load'
import save from './cmds/save'
import battle from './cmds/battle'
import loaded from './cmds/loaded'
import folder from './cmds/folder'

async function main() {
	const args: minimist.ParsedArgs = minimist(process.argv.slice(2))
	let cmd: String = args._[0]

	if (args.version || args.v)
		cmd = 'version'

	if (args.help || args.h)
		cmd = 'help'
	
	switch (cmd) {
		case 'help':
			help(args)
			break
		case 'version':
			version(args)
			break
		case 'start':
			start(args)
			break
		case 'load':
			load(args)
			break
		case 'save':
			save(args)
			break
		case 'battle':
			battle(args)
			break
		case 'loaded':
			loaded(args)
			break
		case 'folder':
			folder(args)
			break
		default:
			console.error(`"${cmd}" is not a valid command!`)
			break
	}
}

main()