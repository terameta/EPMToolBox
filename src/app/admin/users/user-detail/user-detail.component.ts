import { Component, OnInit } from '@angular/core';
import { select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { combineLatest, filter, map, tap } from 'rxjs/operators';
import { User, UserRole, UserType } from '../../../../../shared/models/user';
import { enum2array, SortByName } from '../../../../../shared/utilities/utilityFunctions';
import { Service } from '../users.service';
import { DimeProcess } from '../../../../../shared/model/dime/process';
import { DimeProcessActions } from '../../dimeprocess/dimeprocess.actions';
import { DimeStream } from '../../../../../shared/model/dime/stream';
import { DimeStreamActions } from '../../dimestream/dimestream.actions';

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
		filter( i => !!i ),
		tap( ( i: User ) => {
			if ( !i.clearance ) i.clearance = {};
			if ( !i.clearance.processes ) i.clearance.processes = {};
			if ( !i.clearance.streamExports ) i.clearance.streamExports = {};
		} )
	);

	public processes$: Observable<DimeProcess[]> = this.srvc.store.pipe(
		select( 'process' ),
		map( state => state.ids.map( ( id: number ) => state.items[id] ).sort( SortByName ) )
	);

	public streams$: Observable<DimeStream[]> = this.srvc.store.pipe(
		select( 'stream' ),
		map( state => Object.values( state.items ).sort( SortByName ).map( i => ( i as DimeStream ) ) )
	);

	constructor( public srvc: Service ) { }

	ngOnInit() {
		this.srvc.store.dispatch( DimeProcessActions.ALL.LOAD.INITIATEIFEMPTY.action() );
		this.srvc.store.dispatch( DimeStreamActions.ALL.LOAD.initiateifempty() );
		console.log( 'Migrate from production database to here and test the clearances' );
	}

	public emailChanged = ( item: User ) => {
		if ( item.type === UserType.Directory ) {
			item.username = item.email;
		}
	}

}
