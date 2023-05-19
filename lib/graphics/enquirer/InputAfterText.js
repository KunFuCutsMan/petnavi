const { Input } = require('enquirer');

class InputAfterText extends Input {
	constructor(options = {}) {
		super(options);
		this.value = options.initial || '';
		this.textToShow = options.textToShow || ''
	}
	
	async render() {
		this.clear();

		let prefix = await this.prefix();
		let message = await this.message();
		let prompt = `${prefix} ${message}: ${this.value}`;

		this.write( [this.textToShow, prompt].join('\n') );
	}
}

module.exports = InputAfterText