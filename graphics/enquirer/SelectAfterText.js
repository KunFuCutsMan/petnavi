const { Select } = require('enquirer');

class SelectAfterText extends Select {
	constructor(options = {}) {
		super(options);
		this.textToShow = options.textToShow || ''
	}
	
	async render() {
		this.clear(this.state.size);

		let prefix = await this.prefix();
		let message = await this.message();
		let separator = await this.separator();
		let output = await this.format();
		let prompt = `${prefix} ${message} ${separator} `;
		let body = await this.renderChoices();

		if (output) prompt += output;

		this.write( [this.textToShow, prompt, body].join('\n') );
		this.restore()
	}
}

module.exports = SelectAfterText