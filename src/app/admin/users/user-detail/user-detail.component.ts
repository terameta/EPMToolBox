import { Component, OnInit } from '@angular/core';
import { select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { combineLatest, filter, map } from 'rxjs/operators';
import { User, UserRole, UserType } from '../../../../../shared/models/user';
import { enum2array } from '../../../../../shared/utilities/utilityFunctions';
import { Service } from '../users.service';

@Component( {
	selector: 'app-user-detail',
	templateUrl: './user-detail.component.html',
	styleUrls: ['./user-detail.component.scss']
} )
export class UserDetailComponent implements OnInit {
	public types = enum2array( UserType );
	public userType = UserType;
	public roles = enum2array( UserRole );
	public item$: Observable<User> = this.srvc.store.pipe(
		select( 'users' ),
		filter( state => state.loaded ),
		combineLatest( this.srvc.store.pipe( select( 'central' ), map( s => s.currentID ) ) ),
		map( ( [s, id] ) => ( s.items[id] ) ),
		filter( i => !!i )
	);

	constructor(
		public srvc: Service
	) { }

	ngOnInit() { }

}
