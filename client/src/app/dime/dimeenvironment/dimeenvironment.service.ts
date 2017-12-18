import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AppState } from '../../ngstore/models';

import { Store } from '@ngrx/store';

import { ToastrService } from 'ngx-toastr';

import * as _ from 'lodash';

import { DimeEnvironment } from '../../../../../shared/model/dime/environment';
import { DimeEnvironmentDetail } from '../../../../../shared/model/dime/environmentDetail';

import { SortByName, EnumToArray } from '../../../../../shared/utilities/utilityFunctions';
import { DimeEnvironmentType, dimeGetEnvironmentTypeDescription } from '../../../../../shared/enums/dime/environmenttypes';
import { DimeEnvironmentActions } from 'app/dime/dimeenvironment/dimeenvironment.actions';

@Injectable()
export class DimeEnvironmentService {
	// items: Observable<DimeEnvironment[]>;
	// curItem: DimeEnvironment;
	// typeList: DimeEnvironmentType[];
	// private _items: BehaviorSubject<DimeEnvironment[]>;
	// private baseUrl: string;
	// private dataStore: {
	// 	items: DimeEnvironment[]
	// };
	private serviceName = 'Environments';

	public itemList: DimeEnvironment[];
	public itemObject: { [key: number]: DimeEnvironment };
	public currentItem: DimeEnvironmentDetail;
	public typeList = EnumToArray( DimeEnvironmentType );
	public getEnvironmentTypeDescription = dimeGetEnvironmentTypeDescription;

	constructor(
		// private http: Http,
		// private authHttp: AuthHttp,
		private toastr: ToastrService,
		private store: Store<AppState>,
		private router: Router
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

	/*


		public listDatabases = ( environmentID: number ) => {
			return this.authHttp.get( this.baseUrl + '/listDatabases/' + environmentID ).
				map( ( response: Response ) => {
					return response.json();
				} ).
				catch( ( error: Response ) => {
					console.log( error );
					return Observable.throw( 'Listing environment databases has failed' );
				} );
		}
		public listTables = ( environmentID: number, dbName: string ) => {
			return this.authHttp.get( this.baseUrl + '/listTables/' + environmentID + '/' + dbName ).
				map( ( response: Response ) => {
					return response.json();
				} ).
				catch( ( error: Response ) => {
					console.log( error );
					return Observable.throw( 'Listing environment tables has failed' );
				} );
		}
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
