class Subject {

	constructor() {
		this.observers = []
	}

	attach( Observer ) {
		if ( this.observers.includes( Observer ) )
			return

		this.observers.push( Observer )
	}

	detach( Observer ) {
		const observerIdx = this.observers.indexOf( Observer )

		if ( observerIdx === -1 )
			return

		this.observers.splice( observerIdx, 1 )
	}

	notify( State ) {
		for (const observer of this.observers)
			observer.update( State )
	}
}

class Observer {
	constructor() {}

	update( Subject ) {}
}

module.exports = {
	Subject,
	Observer
}