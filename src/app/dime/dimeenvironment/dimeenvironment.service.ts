import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AppState } from '../../ngstore/models';

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

@Injectable()
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
		this.store.select( 'dimeEnvironment' ).subscribe( environmentState => {
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
		this.router.navigateByUrl( '/dime/environments/environment-detail/' + id );
	}

	public isPBCS = () => {
		return DimeEnvironmentType[this.currentItem.type] === 'PBCS';
	}

	public verify = ( id: number ) => {
		this.store.dispatch( DimeEnvironmentActions.ONE.VERIFY.initiate( id ) );
	}

	public listDatabases = ( id: number ) => {
		return this.backend.listDatabases( id )
			.catch( resp => {
				this.store.dispatch( DimeStatusActions.error( resp, this.serviceName ) );
				return resp;
			} );
	}

	public listTables = ( id: number, db: string ) => {
		return this.backend.listTables( id, db )
			.catch( resp => {
				this.store.dispatch( DimeStatusActions.error( resp, this.serviceName ) );
				return resp;
			} );
	}

	public listDescriptiveTables = ( id: number, db: string, cube: string ) => {
		return this.backend.listDescriptiveTables( id, db, cube )
			.catch( resp => {
				this.store.dispatch( DimeStatusActions.error( resp, this.serviceName ) );
				return resp;
			} );
	}

	public testAll = () => {
		this.backend.testAll().subscribe( resp => {
			this.testResult = resp;
		}, error => {
			this.testResult = error;
		} );
		// .catch( resp => {
		// 	this.store.dispatch( DimeStatusActions.error( resp, this.serviceName ) );
		// 	return resp;
		// } );
	}

	/*




		public listProcedures = ( environmentID: number, curStream: DimeStream ) => {
			return this.authHttp.post( this.baseUrl + '/listProcedures/' + environmentID, curStream, { headers: this.headers } ).
				map( ( response: Response ) => {
					return response.json();
				} ).
				catch( ( error: Response ) => {
					this.toastr.error( 'Failed to list procedures for environment ' + environmentID + '.', this.serviceName );
					console.log( error );
					return Observable.throw( error );
				} )
		}
		public listProcedureDetails = ( environmentID: number, details: any ) => {
			return this.authHttp.post( this.baseUrl + '/listProcedureDetails/' + environmentID, details, { headers: this.headers } ).
				map( response => response.json() ).
				catch( ( error ) => {
					return Observable.throw( error );
				} );
		}
	*/
}
