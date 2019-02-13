import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';
import { SignOut } from '../../auth/auth.actions';

@Component( {
	selector: 'app-dimemenu',
	templateUrl: './dimemenu.component.html',
	styleUrls: ['./dimemenu.component.css']
} )
export class DimemenuComponent {

	constructor( private store: Store<AppState> ) { }

	public signOut = () => this.store.dispatch( new SignOut() );
}
