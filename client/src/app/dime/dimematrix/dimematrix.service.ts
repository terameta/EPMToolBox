import { ActivatedRoute, Router } from '@angular/router';
import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { ToastrService } from 'ngx-toastr/toastr/toastr-service';
import { AuthHttp } from 'angular2-jwt';

import { DimeStreamService } from '../dimestream/dimestream.service';
import { DimeMap } from '../../../../../shared/model/dime/map';
import { DimeMatrix } from '../../../../../shared/model/dime/matrix';
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
	curItemClean: boolean;
	curItemMap: DimeMap;
	curItemStream: DimeStream;
	curItemStreamFields: DimeStreamField[];

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
				if ( this.curItem.map ) { this.getMapDefinition( this.curItem.map ); }
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
				if ( this.curItem.map ) { this.getMapDefinition( this.curItem.map ); }
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
		this.mapService.fetchOne( id ).subscribe(( result ) => {
			this.curItemMap = result;
			this.getStreamDefinition( this.curItemMap.target );
			this.getStreamFields( this.curItemMap.target );
		}, ( error ) => {
			this.toastr.error( 'Failed to fetch map definition.', this.serviceName );
			console.log( error );
		} );
	};
	private getMapFields = ( id: number ) => {
		this.mapService.
	}
	private getStreamDefinition = ( id: number ) => {
		this.streamService.fetchOne( id ).subscribe(( result ) => {
			this.curItemStream = result;
		}, ( error ) => {
			this.toastr.error( 'Failed to fetch stream definition.', this.serviceName );
			console.log( error );
		} )
	};
	private getStreamFields = ( id: number ) => {
		this.streamService.retrieveFieldsFetch( id ).subscribe(( result ) => {
			this.curItemStreamFields = result;
		}, ( error ) => {
			this.toastr.error( 'Failed to fetch stream fields list.', this.serviceName );
			console.log( error );
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

}
