import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState } from "../../app.state";
import * as fromDirectories from './directories.actions';
import { Directory } from "../../../../shared/models/directory";

@Injectable( { providedIn: 'root' } )
export class Service {
	public serviceName = 'Directories';

	constructor( public store: Store<AppState> ) { this.load(); }

	public load = () => this.store.dispatch( new fromDirectories.Load() );
	public create = () => this.store.dispatch( new fromDirectories.Create( {} as Directory ) );
	public update = ( payload: Directory ) => this.store.dispatch( new fromDirectories.Update( payload ) );
	public delete = ( payload: Directory ) => {
		const verificationQuestion = this.serviceName + ': Are you sure you want to delete ' + ( payload.name || 'the directory' ) + '?';
		if ( confirm( verificationQuestion ) ) {
			this.store.dispatch( new fromDirectories.Delete( payload.id ) );
		}
	}
}
