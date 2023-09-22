import minimist from 'minimist'
import * as p from '../../package.json'

export default async function version(args: minimist.ParsedArgs) {
	console.log(`v${p.version}`)
}