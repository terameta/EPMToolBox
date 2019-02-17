import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';

import { ToastrService } from 'ngx-toastr';

import * as _ from 'lodash';

import { DimeEnvironment } from '../../../../shared/model/dime/environment';
import { DimeEnvironmentDetail } from '../../../../shared/model/dime/environmentDetail';

import { SortByName, EnumToArray } from '../../../../shared/utilities/utilityFunctions';
import { DimeEnvironmentType, dimeGetEnvironmentTypeDescription } from '../../../../shared/enums/dime/environmenttypes';
import { DimeEnvironmentActions } from './dimeenvironment.actions';
import { DimeEnvironmentBackend } from './dimeenvironment.backend';
import { DimeStatusActions } from '../../ngstore/applicationstatus';
import { DimeStream } from '../../../../shared/model/dime/stream';
import { catchError } from 'rxjs/operators';
import { AppState } from '../../app.state';

@Injectable( { providedIn: 'root' } )
export class DimeEnvironmentService {
	private serviceName = 'Environments';

	public itemList: DimeEnvironment[];
	public itemObject: { [key: number]: DimeEnvironment };
	public currentItem: DimeEnvironmentDetail;
	public typeList = EnumToArray( DimeEnvironmentType );
	public typeObject = _.keyBy( this.typeList, 'value' );
	public getEnvironmentTypeDescription = dimeGetEnvironmentTypeDescription;
	public testResult: any;

	constructor(
		private toastr: ToastrService,
		private store: Store<AppState>,
		private router: Router,
		private backend: DimeEnvironmentBackend
	) {
		this.store.select( 'environment' ).subscribe( environmentState => {
			this.itemList = _.values( environmentState.items ).sort( SortByName );
			this.itemObject = environmentState.items;
			this.currentItem = environmentState.curItem;
		} );
	}

	public create = () => {
		this.store.dispatch( DimeEnvironmentActions.ONE.CREATE.initiate( <DimeEnvironmentDetail>{} ) );
	}

	public update = () => {
		this.store.dispatch( DimeEnvironmentActions.ONE.UPDATE.initiate( this.currentItem ) );
	}

	public delete = ( id: number, name?: string ) => {
		const verificationQuestion = this.serviceName + ': Are you sure you want to delete ' + ( name !== undefined ? name : 'the item' ) + '?';
		if ( confirm( verificationQuestion ) ) {
			this.store.dispatch( DimeEnvironmentActions.ONE.DELETE.initiate( id ) );
		}
	}

	public navigateTo = ( id: number ) => {
		this.router.navigateByUrl( '/admin/environments/' + id );
	}

	public isPBCS = () => {
		return DimeEnvironmentType[this.currentItem.type] === 'PBCS';
	}

	public verify = ( id: number ) => {
		this.store.dispatch( DimeEnvironmentActions.ONE.VERIFY.initiate( id ) );
	}

	public listDatabases = ( id: number ) => {
		return this.backend.listDatabases( id ).pipe(
			catchError( resp => {
				this.store.dispatch( DimeStatusActions.error( resp, this.serviceName ) );
				return resp;
			} ) );
	}

	public listTables = ( id: number, db: string ) => {
		return this.backend.listTables( id, db ).pipe(
			catchError( resp => {
				this.store.dispatch( DimeStatusActions.error( resp, this.serviceName ) );
				return resp;
			} ) );
	}

	public listDescriptiveTables = ( id: number, db: string, cube: string ) => {
		return this.backend.listDescriptiveTables( id, db, cube ).pipe(
			catchError( resp => {
				this.store.dispatch( DimeStatusActions.error( resp, this.serviceName ) );
				return resp;
			} ) );
	}

	public testAll = () => {
		this.backend.testAll().subscribe( resp => {
			this.testResult = resp;
		}, error => {
			this.testResult = error;
		} );
	}

	public listProcedures = ( environmentID: number, stream: DimeStream ) => this.backend.listProcedures( environmentID, stream );
	public listProcedureDetails = ( environmentID: number, details: any ) => this.backend.listProcedureDetails( environmentID, details );
}
