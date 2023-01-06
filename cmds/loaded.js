const NFM = require('../utils/NaviFileManager')
const NaviCardUI = require('../graphics/NaviCardUI')

module.exports = async (args) => {
	const loadedNavis = await NFM.getAllLoadedNavis()
	const UI = new NaviCardUI(80)

	for (const navi of loadedNavis) {
		console.log( UI.getFullNaviCard(navi) )
		UI.resetUI()
	}
}