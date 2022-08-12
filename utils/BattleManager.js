module.exports = class BattleManager {
	constructor(navi, enemyList, canEscape) {
		this.navi = navi
		this.enemyList = enemyList

		// Setting up for being able to escape
		this.isPossibleToEscape = canEscape
		this.isEscaped = false

		this.actionQueue = []
	}

	isBattleOver() {
		if ( this.isEscaped ) // Player escaped
			return true
		else if ( this.navi.HP <= 0 ) // Player lost
			return true
		else if ( this.enemyList.length <= 0 ) // Player won
			return true
		else return false
	}

	// "Attack" action
	naviAttacks(target) {
		const enemy = this.enemyList.find( o => {
			return o.name === target
		} )
		enemy.HP -= 10
		this.enemyLifeCheck()
	}

	// "Escape action"
	naviEscapes() {
		if (!this.isPossibleToEscape) {
			this.addToActionQueue("It's not possible to escape!")
			return
		}

		// Randomly assign if navi was able to escape
		const EscapePercent = 1/5
		this.isEscaped =
			Math.round( Math.random() * EscapePercent * 10 )
			>= Math.floor( EscapePercent * 10 )

		if (!this.isEscaped)
			this.addToActionQueue("...But couldn't!")
	}

	// Add a string to the turn's 
	addToActionQueue(str) {
		this.actionQueue.push(str)
	}

	clearActionQueue() {
		this.actionQueue = []
	}

	// this.enemyList is modified to its normal state
	// minus the enemies which have 0 or less hp
	enemyLifeCheck() {
		this.enemyList = this.enemyList.filter( e => {
			return e.HP > 0
		})
	}
}
