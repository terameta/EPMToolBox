import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DimeEnvironment } from '../../../../../shared/model/dime/environment';
import { DimeEnvironmentDetail } from '../../../../../shared/model/dime/environmentDetail';

@Injectable()
export class DimeEnvironmentBackend {
	private baseUrl = '/api/dime/environment';

	constructor( private http: HttpClient ) { }

	public allLoad = (): Observable<DimeEnvironment[]> => this.http.get<DimeEnvironment[]>( this.baseUrl );
	public oneLoad = ( id: number ): Observable<DimeEnvironmentDetail> => this.http.get<DimeEnvironmentDetail>( this.baseUrl + '/' + id );
	public oneCreate = ( refItem: DimeEnvironmentDetail ): Observable<DimeEnvironmentDetail> => this.http.post<DimeEnvironmentDetail>( this.baseUrl, refItem );
	public oneUpdate = ( refItem: DimeEnvironmentDetail ): Observable<DimeEnvironmentDetail> => this.http.put<DimeEnvironmentDetail>( this.baseUrl, refItem );
	public oneDelete = ( id: number ) => this.http.delete( this.baseUrl + '/' + id );

	public listDatabases = ( id: number ) => this.http.get( this.baseUrl + '/listDatabases/' + id );
	public listTables = ( id: number, db: string ) => this.http.get( this.baseUrl + '/listTables/' + id + '/' + db );

	public oneVerify = ( id: number ) => {
		return this.http.get( this.baseUrl + '/verify/' + id );
	}
}
