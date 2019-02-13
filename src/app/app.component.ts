import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from './app.state';
import { map } from 'rxjs/operators';

@Component( {
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
} )
export class AppComponent {
	public state$ = this.store;

	constructor( private store: Store<AppState> ) {
		console.log( 'We should implement the store freeze' );
	}
}
