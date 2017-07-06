import { ActivatedRoute, Router } from '@angular/router';
import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { ToastrService } from 'ngx-toastr/toastr/toastr-service';
import { AuthHttp } from 'angular2-jwt';

import { DimeStreamService } from '../dimestream/dimestream.service';
import { DimeMap } from '../../../../../shared/model/dime/map';
import { DimeMatrix } from '../../../../../shared/model/dime/matrix';
import { DimeMatrixField } from '../../../../../shared/model/dime/matrixfield';
import { DimeStream } from '../../../../../shared/model/dime/stream';
import { DimeStreamField } from '../../../../../shared/model/dime/streamfield';
import { DimeMapService } from '../dimemap/dimemap.service';

@Injectable()
export class DimeMatrixService {
	private serviceName: string;
	private baseUrl: string;
	private headers = new Headers( { 'Content-Type': 'application/json' } );

	private dataStore: { items: DimeMatrix[] };
	private _items: BehaviorSubject<DimeMatrix[]>;
	items: Observable<DimeMatrix[]>;
	itemCount: Observable<number>;
	curItem: DimeMatrix;
	curItemFields: DimeMatrixField[];
	curItemAssignedFields: DimeMatrixField[];
	curItemClean: boolean;
	curItemMap: DimeMap;
	curItemMapFields: any[];
	curItemStream: DimeStream;
	curItemStreamFields: DimeStreamField[];
	curItemReady: boolean;
	streamTypes: any[];
	matrixTable: any[];

	constructor(
		private http: Http,
		private authHttp: AuthHttp,
		private toastr: ToastrService,
		private router: Router,
		private route: ActivatedRoute,
		private mapService: DimeMapService,
		private streamService: DimeStreamService
	) {
		this.baseUrl = '/api/dime/matrix';
		this.dataStore = { items: [] };
		this._items = <BehaviorSubject<DimeMatrix[]>>new BehaviorSubject( [] );
		this.items = this._items.asObservable();
		this.itemCount = this.items.count();
		this.serviceName = 'Matrices';
		this.resetCurItem();
		this.getAll( true );
	}

	private resetCurItem = () => {
		this.curItem = <DimeMatrix>{ id: 0 };
		this.curItemClean = true;
		this.curItemStream = <DimeStream>{ id: 0 };
		this.curItemStreamFields = [];
		this.curItemReady = false;
		this.matrixTable = [];
	};
	public getAll = ( isSilent?: boolean ) => {
		this.fetchAll().subscribe(( data ) => {
			data.sort( this.sortByName );
			this.dataStore.items = data;
			this._items.next( Object.assign( {}, this.dataStore ).items );
			if ( !isSilent ) { this.toastr.info( 'Items are loaded.', this.serviceName ); }
		}, ( error ) => {
			this.toastr.error( 'Failed to get items from server.', this.serviceName );
			console.log( error );
		} );
	};
	public fetchAll = () => {
		return this.authHttp.get( this.baseUrl ).
			map( response => response.json() ).
			catch( error => Observable.throw( error ) );
	};
	public create = () => {
		this.authHttp.post( this.baseUrl, {}, { headers: this.headers } )
			.map( response => response.json() ).subscribe( data => {
				this.dataStore.items.push( data );
				this._items.next( Object.assign( {}, this.dataStore ).items );
				this.resetCurItem();
				this.router.navigate( ['/dime/matrices/matrix-detail', data.id] );
				this.toastr.info( 'New item is created, navigating to the details', this.serviceName );
			}, ( error ) => {
				this.toastr.error( 'Failed to create new item.', this.serviceName );
				console.log( error );
			} );
	};
	getOne = ( id: number ) => {
		this.fetchOne( id ).
			subscribe(( result ) => {
				let notFound = true;

				this.dataStore.items.forEach(( item, index ) => {
					if ( item.id === result.id ) {
						this.dataStore.items[index] = result;
						notFound = false;
					}
				} );

				if ( notFound ) {
					this.dataStore.items.push( result );
				}

				this.dataStore.items.sort( this.sortByName );
				this._items.next( Object.assign( {}, this.dataStore ).items );
				this.curItem = result;
				this.curItemClean = true;
				this.prepareMatrixDefinitions();
			}, ( error ) => {
				this.toastr.error( 'Failed to get the item.', this.serviceName );
				console.log( error );
			} );
	};
	public fetchOne = ( id: number ) => {
		return this.authHttp.get( this.baseUrl + '/' + id ).
			map( response => response.json() ).
			catch( error => Observable.throw( error ) );
	};
	public update = ( curItem?: DimeMatrix ) => {
		let shouldUpdate = false;
		if ( !curItem ) { curItem = this.curItem; shouldUpdate = true; };
		this.authHttp.put( this.baseUrl, curItem, { headers: this.headers } ).
			map( response => response.json() ).
			subscribe( data => {
				this.dataStore.items.forEach(( item, index ) => {
					if ( item.id === data.id ) { this.dataStore.items[index] = data; }
				} );

				this._items.next( Object.assign( {}, this.dataStore ).items );
				this.toastr.info( 'Item is successfully saved.', this.serviceName );
				// If the update request came from another source, then it is an ad-hoc save of a non-current stream.
				// This shouldn't change the state of the current item.
				if ( shouldUpdate ) { this.curItemClean = true; }
				this.prepareMatrixDefinitions();
			}, error => {
				this.toastr.error( 'Failed to save the item.', this.serviceName );
				console.log( error );
			} );
	};
	public delete( id: number, name?: string ) {
		const verificationQuestion = this.serviceName + ': Are you sure you want to delete ' + ( name !== undefined ? name : 'the item' ) + '?';
		if ( confirm( verificationQuestion ) ) {
			this.authHttp.delete( this.baseUrl + '/' + id ).subscribe( response => {
				this.dataStore.items.forEach(( item, index ) => {
					if ( item.id === id ) { this.dataStore.items.splice( index, 1 ); }
				} );

				this._items.next( Object.assign( {}, this.dataStore ).items );
				this.toastr.info( 'Item is deleted.', this.serviceName );
				this.router.navigate( ['/dime/matrices/matrix-list'] );
				this.resetCurItem();
			}, ( error ) => {
				this.toastr.error( 'Failed to delete item.', this.serviceName );
				console.log( error );
			} );
		} else {
			this.toastr.info( 'Item deletion is cancelled.', this.serviceName );
		}
	};
	private getMapDefinition = ( id: number ) => {
		return new Promise(( resolve, reject ) => {
			this.mapService.fetchOne( id ).subscribe(( result ) => {
				resolve( result );
			}, ( error ) => {
				this.toastr.error( 'Failed to fetch map definition.', this.serviceName );
				console.log( error );
				reject( error );
			} );
		} );
	};
	private getMapFields = ( id: number ) => {
		return new Promise(( resolve, reject ) => {
			this.mapService.fetchFields( id ).subscribe(( data ) => {
				resolve( data );
			}, ( error ) => {
				this.toastr.error( 'Failed to fetch map fields.', this.serviceName );
				console.log( error );
				reject( error );
			} );
		} );
	};
	private getStreamDefinition = ( id: number ) => {
		return new Promise(( resolve, reject ) => {
			this.streamService.fetchOne( id ).subscribe(( result ) => {
				resolve( result );
			}, ( error ) => {
				this.toastr.error( 'Failed to fetch stream definition.', this.serviceName );
				console.log( error );
				reject( error );
			} );
		} );
	};
	private getStreamFields = ( id: number ) => {
		return new Promise(( resolve, reject ) => {
			this.streamService.retrieveFieldsFetch( id ).subscribe(( result ) => {
				resolve( result );
			}, ( error ) => {
				this.toastr.error( 'Failed to fetch stream fields list.', this.serviceName );
				console.log( error );
				reject( error );
			} );
		} );
	};
	private getStreamTypes = () => {
		return new Promise(( resolve, reject ) => {
			this.streamService.listTypesFetch().subscribe(( result ) => {
				resolve( result );
			}, ( error ) => {
				this.toastr.error( 'Failed to fetch stream types.', this.serviceName );
				console.log( error );
				reject( error );
			} );
		} );
	}
	private sortByName = ( e1, e2 ) => {
		if ( e1.name > e2.name ) {
			return 1;
		} else if ( e1.name < e2.name ) {
			return -1;
		} else {
			return 0;
		}
	};
	private sortByOrder = ( e1, e2 ) => {
		if ( e1.fOrder > e2.fOrder ) {
			return 1;
		} else if ( e1.fOrder < e2.fOrder ) {
			return -1;
		} else {
			return 0;
		}
	};
	private fetchMatrixFields = ( id: number ) => {
		return this.authHttp.get( this.baseUrl + '/fields/' + id ).
			map( response => response.json() ).
			catch( error => Observable.throw( error ) );
	}
	private getMatrixFields = ( id: number ) => {
		return new Promise(( resolve, reject ) => {
			this.fetchMatrixFields( id ).subscribe(( result ) => {
				this.curItemAssignedFields = result;
				resolve();
			}, ( error ) => {
				this.toastr.error( 'Failed to fetch assigned fields' );
				console.log( error );
				reject( error );
			} );
		} );

	};
	private setMatrixFields = () => {
		this.authHttp.put( this.baseUrl + '/fields/', { id: this.curItem.id, fields: this.curItemFields } ).
			map( response => response.json() ).
			subscribe(( result ) => {
				console.log( result );
				this.prepareMatrixDefinitions();
			}, ( error ) => {
				this.toastr.error( 'Failed to set the fields.', this.serviceName );
				console.error( error );
			} );
	};
	private prepareMatrixDefinitions = () => {
		if ( this.curItem.map ) {
			this.getMapDefinition( this.curItem.map ).
				then(( curMap: DimeMap ) => { this.curItemMap = curMap; return this.getMapFields( this.curItem.map ); } ).
				then(( curMapFields: any[] ) => { this.curItemMapFields = curMapFields; return this.getStreamDefinition( this.curItemMap.target ); } ).
				then(( curStream: DimeStream ) => { this.curItemStream = curStream; return this.getStreamFields( this.curItemMap.target ); } ).
				then(( curStreamFields: DimeStreamField[] ) => { this.curItemStreamFields = curStreamFields; return this.getStreamTypes(); } ).
				then(( streamTypes: any[] ) => { this.streamTypes = streamTypes; return this.getMatrixFields( this.curItem.id ); } ).
				then( this.prepareMatrixFields ).
				then(() => {
					this.toastr.info( 'Matrix definition is now ready', this.serviceName );
				} ).
				catch(( issue ) => {
					this.toastr.error( 'Failed to prepare matrix', this.serviceName );
					console.log( issue );
				} );
		} else {
			this.curItemReady = false;
		}
	};
	private prepareMatrixFields = () => {
		this.curItemFields = [];
		return new Promise(( resolve, reject ) => {
			this.curItemMapFields.forEach(( mapField ) => {
				if ( mapField.srctar === 'target' ) {
					let toPush: DimeMatrixField; toPush = <DimeMatrixField>{};
					toPush.name = mapField.name;
					toPush.map = mapField.map;
					this.curItemFields.push( toPush );
				}
			} );
			this.streamTypes.forEach(( streamType ) => {
				if ( streamType.id === this.curItemStream.type ) {
					if ( streamType.value === 'HPDB' ) {
						this.curItemStreamFields.forEach(( curStreamField ) => {
							curStreamField.isDescribed = true;
						} );
					}
				}
			} );
			this.curItemFields.forEach(( curMatrixField ) => {
				this.curItemStreamFields.forEach(( curStreamField ) => {
					if ( curStreamField.name === curMatrixField.name && !curStreamField.isData ) {
						curMatrixField.fOrder = curStreamField.fOrder;
						curMatrixField.isDescribed = curStreamField.isDescribed;
						curMatrixField.stream = curStreamField.stream;
						curMatrixField.streamFieldID = curStreamField.id;
					}
				} );
			} );
			this.curItemFields.sort( this.sortByOrder );
			this.curItemFields.forEach(( curMatrixField ) => {
				curMatrixField.isAssigned = false;
				curMatrixField.matrix = this.curItem.id;
				this.curItemAssignedFields.forEach(( curAssignedField ) => {
					if ( curAssignedField.name === curMatrixField.name ) {
						curMatrixField.id = curAssignedField.id;
						curMatrixField.isAssigned = curAssignedField.isAssigned;
						curMatrixField.fOrder = curAssignedField.fOrder;
					}
				} )
			} );
			this.curItemReady = true;
			resolve( 'OK' );
		} );
	};
	private prepareMatrixTables = () => {
		this.authHttp.get( this.baseUrl + '/prepareTables/' + this.curItem.id ).
			map( response => response.json() ).
			subscribe(( result ) => {
				this.toastr.info( 'Matrix tables are now prepared, you can populate matrix data.', this.serviceName );
			}, ( error ) => {
				this.toastr.error( 'Failed to prepare matrix tables.', this.serviceName );
				console.error( error );
			} );
	};
	public fetchMatrixTable = ( currentFilter?: any ) => {
		if ( !currentFilter ) {
			currentFilter = {};
		}
		return this.authHttp.
			post( this.baseUrl + '/getMatrixTable', { id: this.curItem.id, filters: currentFilter } ).
			map( response => response.json() ).
			catch( error => Observable.throw( error ) );
	};
	public saveMatrixTuple = ( matrixEntry: any ) => {
		return this.authHttp.post( this.baseUrl + '/saveMatrixTuple', matrixEntry ).
			map( response => response.json() ).
			catch( error => Observable.throw( error ) );
	};
}
