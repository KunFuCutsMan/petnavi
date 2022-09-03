const NFM = require('../utils/NaviFileManager')
const BattleUI = require('../utils/BattleUI')

module.exports = async (args) => {
	const loadedNavis = await NFM.getAllLoadedNavis()
	const UI = new BattleUI('')

	for (const navi of loadedNavis) {
		console.log( UI.getFullNaviCard(navi) )
		UI.resetUI()
	}
}