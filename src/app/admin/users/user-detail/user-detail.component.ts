import { Component, OnInit } from '@angular/core';
import { select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { combineLatest, filter, map } from 'rxjs/operators';
import { User, UserRole, UserType } from '../../../../../shared/models/user';
import { enum2array } from '../../../../../shared/utilities/utilityFunctions';
import { Service } from '../users.service';
import { DimeProcess } from '../../../../../shared/model/dime/process';
import { DimeProcessActions } from '../../dimeprocess/dimeprocess.actions';

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

	public processes$: Observable<DimeProcess[]> = this.srvc.store.pipe(
		select( 'process' )
	);

	constructor( public srvc: Service ) { }

	ngOnInit() {
		this.srvc.store.dispatch( DimeProcessActions.ALL.LOAD.INITIATEIFEMPTY.action() );
	}

	public emailChanged = ( item: User ) => {
		if ( item.type === UserType.Directory ) {
			item.username = item.email;
		}
	}

}
