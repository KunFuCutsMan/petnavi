const { Confirm } = require('enquirer')

class ConfirmAfterText extends Confirm {
	constructor( options ) {
		super(options)
		this.textToShow = options.textToShow || ''
	}

	async render() {
	    let prefix = await this.prefix();
	    let sep = await this.separator();
	    let msg = await this.message();
	    let hint = this.styles.muted(this.default);

    	let promptLine = [prefix, msg, hint, sep].filter(Boolean).join(' ');

		this.clear( this.state.size );
    	this.write( [this.teextToShow, promptLine].join('\n') );
    	this.restore();
	}
}

module.exports = ConfirmAfterText