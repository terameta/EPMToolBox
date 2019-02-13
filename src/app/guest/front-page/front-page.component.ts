import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';
import { UserRole } from '../../../../shared/models/user';

@Component( {
	selector: 'app-front-page',
	templateUrl: './front-page.component.html',
	styleUrls: ['./front-page.component.scss']
} )
export class FrontPageComponent {
	public auth$ = this.store.select( 'auth' );
	public userRole = UserRole;

	constructor( private store: Store<AppState> ) { }

}
