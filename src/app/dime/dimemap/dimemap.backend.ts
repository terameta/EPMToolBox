import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { DimeMap, DimeMapRefreshPayload } from '../../../../shared/model/dime/map';

@Injectable()
export class DimeMapBackend {
	private baseUrl = '/api/dime/map';

	constructor( private http: HttpClient ) { }

	public allLoad = (): Observable<DimeMap[]> => this.http.get<DimeMap[]>( this.baseUrl );
	public oneLoad = ( id: number ): Observable<DimeMap> => this.http.get<DimeMap>( this.baseUrl + '/' + id );
	public oneCreate = ( refItem: DimeMap ): Observable<DimeMap> => this.http.post<DimeMap>( this.baseUrl, refItem );
	public oneUpdate = ( refItem: DimeMap ): Observable<DimeMap> => this.http.put<DimeMap>( this.baseUrl, refItem );
	public oneDelete = ( id: number ) => this.http.delete( this.baseUrl + '/' + id );
	public prepare = ( id: number ) => this.http.get( this.baseUrl + '/prepare/' + id );
	public isready = ( id: number ) => this.http.get( this.baseUrl + '/isready/' + id );
	public mapExport = ( id: number ) => this.http.get( this.baseUrl + /mapExport/ + id, { responseType: 'blob' } );
	public mapImport = ( formData: FormData ) => this.http.post( this.baseUrl + '/mapImport', formData );
	public mapRefresh = ( payload: DimeMapRefreshPayload ) => this.http.post( this.baseUrl + '/mapRefresh', payload );
	public saveMapTuple = ( payload: { mapid: number, tuple: any } ) => this.http.post( this.baseUrl + '/saveMapTuple', payload );
	public deleteMapTuple = ( payload: { mapid: number, tupleid: number } ) => this.http.delete( this.baseUrl + '/deleteMapTuple/' + payload.mapid + '/' + payload.tupleid );
}
