const NFM = require('../utils/NaviFileManager')

module.exports = async (args) => {
	const loadedNavis = await NFM.getAllLoadedNavis()

	for (const navi of loadedNavis)
		console.log( NFM.getNaviCard(navi) )
}