import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DimeCredential } from '../../../../../shared/model/dime/credential';
import { DimeCredentialDetail } from '../../../../../shared/model/dime/credentialDetail';

@Injectable()
export class DimeCredentialBackend {
	private baseUrl = '/api/dime/credential';

	constructor( private http: HttpClient ) { }

	public allLoad = (): Observable<DimeCredential[]> => {
		return this.http.get<DimeCredential[]>( this.baseUrl );
	}

	public oneLoad = ( id: number ): Observable<DimeCredentialDetail> => {
		return this.http.get<DimeCredentialDetail>( this.baseUrl + '/' + id );
	}

	public oneCreate = ( refItem: DimeCredentialDetail ): Observable<DimeCredentialDetail> => {
		return this.http.post<DimeCredentialDetail>( this.baseUrl, refItem );
	}

	public oneUpdate = ( refItem: DimeCredentialDetail ): Observable<DimeCredentialDetail> => {
		return this.http.put<DimeCredentialDetail>( this.baseUrl, refItem );
	}

	public oneDelete = ( id: number ) => {
		return this.http.delete( this.baseUrl + '/' + id );
	}
}
