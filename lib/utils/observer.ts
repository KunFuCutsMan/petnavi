export interface Subject<State = unknown> {
	attach( o: Observer ): void

	detach( o: Observer ): void

	notify( s: State ): void
}

export interface Observer<State = unknown> {
	update( s: State ): void
}