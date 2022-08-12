module.exports = class BattleManager {
	constructor(navi, enemyList) {
		this.navi = navi
		this.enemyList = enemyList
	}

	isBattleOver() {
		return this.navi.HP <= 0 || this.enemyList.length <= 0
	}

	naviAttacks(target) {
		const enemy = this.enemyList.find( o => {
			return o.name === target
		} )
		enemy.HP -= 10
		this.enemyLifeCheck()
	}

	enemyLifeCheck() {
		// this.enemyList is modified to its normal state
		// minus the enemies which have 0 or less hp
		this.enemyList = this.enemyList.filter( e => {
			return e.HP > 0
		})
	}
}
