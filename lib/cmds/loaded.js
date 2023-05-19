const NFM = require('../utils/NaviFileManager')
const NaviCardUI = require('../graphics/NaviCardUI')
const { Navi } = require('../classes')

module.exports = async (args) => {
	const loadedNavis = await NFM.getAllLoadedNavis()
	const UI = new NaviCardUI(80)

	for (const naviData of loadedNavis) {
		console.log( UI.getFullNaviCard( new Navi( naviData ) ) )
		UI.resetUI()
	}
}