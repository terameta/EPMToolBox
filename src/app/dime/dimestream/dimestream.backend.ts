import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DimeStream, DimeStreamDetail } from '../../../../shared/model/dime/stream';
import { DimeStreamField, DimeStreamFieldDetail } from '../../../../shared/model/dime/streamfield';


@Injectable()
export class DimeStreamBackend {
	private baseUrl = '/api/dime/stream';

	constructor( private http: HttpClient ) { }

	public allLoad = (): Observable<DimeStream[]> => this.http.get<DimeStream[]>( this.baseUrl );
	public oneLoad = ( id: number ): Observable<DimeStreamDetail> => this.http.get<DimeStreamDetail>( this.baseUrl + '/' + id );
	public oneCreate = ( refItem: DimeStreamDetail ): Observable<DimeStreamDetail> => this.http.post<DimeStreamDetail>( this.baseUrl, refItem );
	public oneUpdate = ( refItem: DimeStreamDetail ): Observable<DimeStreamDetail> => this.http.put<DimeStreamDetail>( this.baseUrl, refItem );
	public oneDelete = ( id: number ) => this.http.delete( this.baseUrl + '/' + id );

	public oneFieldsListFromSourceEnvironment = ( id: number ): Observable<DimeStreamField[]> => this.http.get<DimeStreamField[]>( this.baseUrl + '/fieldsListFromSourceEnvironment/' + id );
	public oneFieldsStartOver = ( id: number ) => this.http.get( this.baseUrl + '/fieldsStartOver/' + id );
	public listFieldsforField = ( body: { environmentID: number, field: DimeStreamFieldDetail } ): Observable<DimeStreamField[]> => this.http.post<DimeStreamField[]>( this.baseUrl + '/listFieldsforField', body );
	public prepareTables = ( id: number ) => this.http.get( this.baseUrl + '/prepareTables/' + id );
	public fetchFieldDescriptions = ( payload: { stream: number, field: number } ) => this.http.post( this.baseUrl + '/getFieldDescriptions', payload );
	public getFieldDescriptionsWithHierarchy = ( payload: { stream: number, field: number } ) => this.http.post( this.baseUrl + '/getFieldDescriptionsWithHierarchy', payload );
	public populateFieldDescriptions = ( id: number ) => this.http.get( this.baseUrl + '/populateFieldDescriptions/' + id );
}
