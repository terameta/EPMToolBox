import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { AppState } from '../../../app.state';

@Component( {
	selector: 'app-user-list',
	templateUrl: './user-list.component.html',
	styleUrls: ['./user-list.component.scss']
} )
export class UserListComponent implements OnInit {
	public state$ = this.store.pipe(
		select( 'users' ),
		filter( state => state.loaded )
	);

	constructor(
		private store: Store<AppState>
	) { }

	ngOnInit() {
	}

}
