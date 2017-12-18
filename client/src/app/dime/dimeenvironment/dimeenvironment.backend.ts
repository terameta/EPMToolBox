import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DimeEnvironment } from '../../../../../shared/model/dime/environment';
import { DimeEnvironmentDetail } from '../../../../../shared/model/dime/environmentDetail';

@Injectable()
export class DimeEnvironmentBackend {
	private baseUrl = '/api/dime/environment';

	constructor( private http: HttpClient ) { }

	public allLoad = (): Observable<DimeEnvironment[]> => {
		return this.http.get<DimeEnvironment[]>( this.baseUrl );
	}

	public oneLoad = ( id: number ): Observable<DimeEnvironmentDetail> => {
		return this.http.get<DimeEnvironmentDetail>( this.baseUrl + '/' + id );
	}

	public oneCreate = ( refItem: DimeEnvironmentDetail ): Observable<DimeEnvironmentDetail> => {
		return this.http.post<DimeEnvironmentDetail>( this.baseUrl, refItem );
	}

	public oneUpdate = ( refItem: DimeEnvironmentDetail ): Observable<DimeEnvironmentDetail> => {
		return this.http.put<DimeEnvironmentDetail>( this.baseUrl, refItem );
	}

	public oneDelete = ( id: number ) => {
		return this.http.delete( this.baseUrl + '/' + id );
	}

	public oneVerify = ( id: number ) => {
		return this.http.get( this.baseUrl + '/verify/' + id );
	}
}
