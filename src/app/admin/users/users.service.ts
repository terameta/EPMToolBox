import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';
import * as fromUsers from './';
import { User } from '../../../../shared/models/user';

@Injectable( { providedIn: 'root' } )
export class Service {
	public serviceName = 'Users';

	constructor( public store: Store<AppState> ) {
		console.log( 'User Service is now constructed' );
		console.log( 'Loading users' );
		this.load();
	}

	public load = () => this.store.dispatch( new fromUsers.Load() );
	public create = () => this.store.dispatch( new fromUsers.Create( {} as User ) );
	public update = ( payload: User ) => this.store.dispatch( new fromUsers.Update( payload ) );
	public delete = ( payload: User ) => {
		const verificationQuestion = this.serviceName + ': Are you sure you want to delete ' + ( payload.name || 'the user' ) + '?';
		if ( confirm( verificationQuestion ) ) {
			this.store.dispatch( new fromUsers.Delete( payload.id ) );
		}
	}
}
