const NFM = require('../utils/NaviFileManager')
const NaviCardUI = require('../graphics/NaviCardUI')
const NaviClass = require('../classes/navi')

module.exports = async (args) => {
	const loadedNavis = await NFM.getAllLoadedNavis()
	const UI = new NaviCardUI(80)

	for (const naviData of loadedNavis) {
		console.log( UI.getFullNaviCard( new NaviClass( naviData ) ) )
		UI.resetUI()
	}
}