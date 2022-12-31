const inquirer = require('inquirer')

const ChipUI = require('../utils/UI/ChipUI')
const PaginatorUI = require('../utils/UI/PaginatorUI')
const NFM = require('../utils/NaviFileManager')

const sleep = (ms = 2000) => new Promise( (r) => setTimeout(r, ms) )

module.exports = async (args) => {
	// Get the navi (and break the program if you don't)
	const naviName = args._[1]
	const navi = await NFM.getNaviWithName( args._[1] )


	if ( !navi ) {
		console.error('Could not find a Navi with the name "'+naviName+'"')
		process.exit(1)
	}

	// Show the menu
	await showInitialActionMenu( navi )

	await NFM.updateNaviStatsInStorage(naviName, navi)
	console.log('Changes have been saved')
}

async function showInitialActionMenu( navi ) {
	const UI = new ChipUI(80)
	UI.resetScreen()
	
	console.log( UI.getCPattackList(navi.CPattacks) )
	const act = await UI.askActionPrompt()

	switch ( act ) {
		case 'View Chips':
			// Do some paginator things
			// https://www.npmjs.com/package/paginator

			await showPaginator( navi.chipLibrary );
			break
		case 'Change Folder':
			const chipToSwitch = await UI.askChipLibrary(
				reduceChipLibToJson(navi.chipLibrary), navi.CPattacks )

			doChangingChipActions(chipToSwitch, navi)
			break
	}

	if ( act !== 'Exit' )
		await showInitialActionMenu( navi )
	else return
}

function reduceChipLibToJson(lib) {
	const obj = {}
	for (const cName of lib) {
		if ( obj[cName] == undefined )
			obj[cName] = 1
		else obj[cName]++
	}

	return obj
}

function doChangingChipActions(chipToSwitch, navi) {
	
	// Remove one chip of the chipToSwap type
	const chipToSwapIdx = navi.chipLibrary.find( c => c == chipToSwitch.chipToSwap )
	navi.chipLibrary.splice( chipToSwapIdx, 1 );

	// And add it to the CPAttacks list from the navi
	if ( chipToSwitch.indexOfChipPlace != undefined ) {
		// Swap the chip
		const oldChip = swapChipWithIndex(
			chipToSwitch.indexOfChipPlace,
			chipToSwitch.chipToSwap,
			navi.CPattacks )

		// And add the old chip to the library
		navi.chipLibrary.push( oldChip ) 
		
	}
	else navi.CPattacks.push( chipToSwitch.chipToSwap )
}

function swapChipWithIndex(idx, newChip, list) {
	for (let i = 0; i < list.length; i++) {
		if ( idx == i ) {
			const oldChip = list[i]
			list[i] = newChip
			return oldChip
		}
		else continue
	}
}

async function showPaginator( list ) {
	const pag = new PaginatorUI( 80, list )
	pag.resetScreen()
	console.log( pag.getPaginatorList() )
	
	action = await pag.askPageMovements().page

	switch ( action ) {
		case 'Previous Page':
			break
		case 'Next Page':
			break
	}

	if ( action !== 'Back' )
		await showPaginator( list )
	else return
}