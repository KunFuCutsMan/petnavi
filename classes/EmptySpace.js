class EmptySpace {
	constructor() {
		this.type = 'EMPTY_SPACE'
		this.line = '[        ]'
	}

	toString() {
		return this.line
	}
}

module.exports = EmptySpace