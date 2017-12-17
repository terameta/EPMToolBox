import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AppState } from '../../ngstore/models';

import { Store } from '@ngrx/store';

import { ToastrService } from 'ngx-toastr';

import * as _ from 'lodash';

import { DimeEnvironment } from '../../../../../shared/model/dime/environment';
import { DimeEnvironmentDetail } from '../../../../../shared/model/dime/environmentDetail';

import { SortByName, EnumToArray } from '../../../../../shared/utilities/utilityFunctions';
import { DimeEnvironmentType, dimeGetEnvironmentType } from '../../../../../shared/enums/dime/environmenttypes';
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
	public getEnvironmentTypeDescription = dimeGetEnvironmentType;

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

	public isPBCS() {
		// console.log( this.currentItem );
		// console.log( this.environmentTypeObject );
		console.log( DimeEnvironmentType[this.currentItem.type], this.currentItem.type, DimeEnvironmentType.PBCS, this.currentItem.type === DimeEnvironmentType.PBCS );
		// const toReturn = false;
		// if ( this.curItem.type ) {
		// 	this.typeList.forEach( ( curType ) => {
		// 		if ( this.curItem.type === curType.id && curType.value === 'PBCS' ) {
		// 			toReturn = true;
		// 		}
		// 	} );
		// }
		// return toReturn;
		console.log( this.typeList );
		return this.currentItem.type === DimeEnvironmentType.PBCS;
	}
	/*
		getAll = ( isSilent?: boolean ) => {
			if ( this.typeList.length === 0 ) { this.listTypes(); }
			this.authHttp.get( this.baseUrl ).
				map( ( response ) => {
					return response.json();
				} ).
				subscribe( ( data ) => {
					data.sort( SortByName );
					this.dataStore.items = data;
					this._items.next( Object.assign( {}, this.dataStore ).items );
					if ( !isSilent ) { this.toastr.info( 'Items are loaded.', this.serviceName ); }
				}, ( error ) => {
					this.toastr.error( 'Failed to load items.', this.serviceName );
					console.log( error );
				} );
		}
		getOne = ( id: number ) => {
			if ( this.typeList.length === 0 ) { this.listTypes(); }
			this.authHttp.get( this.baseUrl + '/' + id ).
				map( response => response.json() ).
				subscribe( ( data ) => {
					let notFound = true;

					this.dataStore.items.forEach( ( item, index ) => {
						if ( item.id === data.id ) {
							this.dataStore.items[index] = data;
							notFound = false;
						}
					} );

					if ( notFound ) {
						this.dataStore.items.push( data );
					}

					this._items.next( Object.assign( {}, this.dataStore ).items );
					this.curItem = data;
				}, ( error ) => {
					this.toastr.error( 'Failed to get the item.', this.serviceName );
					console.log( error );
				} );
		}

		update = ( curItem?: DimeEnvironment ) => {
			if ( !curItem ) { curItem = this.curItem };
			this.authHttp.put( this.baseUrl, curItem, { headers: this.headers } ).
				map( response => response.json() ).
				subscribe( data => {
					this.dataStore.items.forEach( ( item, index ) => {
						if ( item.id === data.id ) { this.dataStore.items[index] = data; }
					} );

					this._items.next( Object.assign( {}, this.dataStore ).items );
					this.toastr.info( 'Item is successfully saved.', this.serviceName );
				}, error => {
					this.toastr.error( 'Failed to save the item.', this.serviceName );
					console.log( error );
				} );
		}
		delete( id: number, name?: string ) {
			const verificationQuestion = this.serviceName + ': Are you sure you want to delete ' + ( name !== undefined ? name : 'the item' ) + '?';
			if ( confirm( verificationQuestion ) ) {
				this.authHttp.delete( this.baseUrl + '/' + id ).subscribe( response => {
					this.dataStore.items.forEach( ( item, index ) => {
						if ( item.id === id ) { this.dataStore.items.splice( index, 1 ); }
					} );

					this._items.next( Object.assign( {}, this.dataStore ).items );
					this.toastr.info( 'Item is deleted.', this.serviceName );
					this.router.navigate( ['/dime/environments/environment-list'] );
					this.curItem = { id: 0 };
				}, ( error ) => {
					this.toastr.error( 'Failed to delete item.', this.serviceName );
					console.log( error );
				} );
			} else {
				this.toastr.info( 'Item deletion is cancelled.', this.serviceName );
			}
		}
		private listTypes() {
			return this.authHttp.get( this.baseUrl + '/listTypes' ).
				map( response => response.json() ).
				subscribe( ( data ) => {
					this.typeList = data;
				}, ( error ) => {
					this.toastr.error( 'Listing types has failed', this.serviceName );
				} );
		}

		public verify = ( itemID?: number ) => {
			if ( !itemID ) { itemID = this.curItem.id; }
			this.authHttp.get( this.baseUrl + '/verify/' + itemID ).
				map( ( response: Response ) => {
					return response.json();
				} ).
				subscribe( ( data ) => {
					this.toastr.info( 'Item is successfully verified. Reloading...', this.serviceName );
					this.getOne( itemID );
				}, ( error ) => {
					this.toastr.error( 'Failed to verify the item.', this.serviceName );
					console.log( error );
				} );
		}
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
