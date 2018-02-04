import { of } from 'rxjs/observable/of';
import { DimeMatrix } from '../../../../shared/model/dime/matrix';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IsReadyPayload } from '../../../../shared/enums/generic/readiness';

@Injectable()
export class DimeMatrixBackend {
	private baseUrl = '/api/dime/matrix';

	constructor( private http: HttpClient ) { }

	public allLoad = (): Observable<DimeMatrix[]> => this.http.get<DimeMatrix[]>( this.baseUrl );
	public oneCreate = ( refObj: DimeMatrix ): Observable<DimeMatrix> => this.http.post<DimeMatrix>( this.baseUrl, refObj );
	public oneLoad = ( id: number ): Observable<DimeMatrix> => this.http.get<DimeMatrix>( this.baseUrl + '/' + id );
	public oneDelete = ( id: number ) => this.http.delete( this.baseUrl + '/' + id );
	public oneUpdate = ( refObj: DimeMatrix ) => this.http.put( this.baseUrl, refObj );
	public prepareTables = ( id: number ) => this.http.get( this.baseUrl + '/prepareTables/' + id );
	public isready = ( id: number ) => this.http.get<IsReadyPayload>( this.baseUrl + '/isReady/' + id );
}
