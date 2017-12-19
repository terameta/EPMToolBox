import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DimeStream, DimeStreamDetail } from '../../../../../shared/model/dime/stream';


@Injectable()
export class DimeStreamBackend {
	private baseUrl = '/api/dime/stream';

	constructor( private http: HttpClient ) { }

	allLoad = (): Observable<DimeStream[]> => this.http.get<DimeStream[]>( this.baseUrl );
	public oneLoad = ( id: number ): Observable<DimeStreamDetail> => this.http.get<DimeStreamDetail>( this.baseUrl + '/' + id );
	public oneCreate = ( refItem: DimeStreamDetail ): Observable<DimeStreamDetail> => this.http.post<DimeStreamDetail>( this.baseUrl, refItem );
	public oneUpdate = ( refItem: DimeStreamDetail ): Observable<DimeStreamDetail> => this.http.put<DimeStreamDetail>( this.baseUrl, refItem );
	public oneDelete = ( id: number ) => this.http.delete( this.baseUrl + '/' + id );
}
