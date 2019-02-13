import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Credential, CredentialDetail } from '../../../../shared/model/dime/credential';

@Injectable( { providedIn: 'root' } )
export class DimeCredentialBackend {
	private baseUrl = '/api/dime/credential';

	constructor( private http: HttpClient ) { }

	public allLoad = (): Observable<Credential[]> => {
		return this.http.get<Credential[]>( this.baseUrl );
	}

	public oneLoad = ( id: number ): Observable<CredentialDetail> => {
		return this.http.get<CredentialDetail>( this.baseUrl + '/' + id );
	}

	public oneCreate = ( refItem: CredentialDetail ): Observable<CredentialDetail> => {
		return this.http.post<CredentialDetail>( this.baseUrl, refItem );
	}

	public oneUpdate = ( refItem: CredentialDetail ): Observable<CredentialDetail> => {
		return this.http.put<CredentialDetail>( this.baseUrl, refItem );
	}

	public oneDelete = ( id: number ) => {
		return this.http.delete( this.baseUrl + '/' + id );
	}

	public oneReveal = ( id: number ): Observable<string> => {
		return this.http.get<string>( this.baseUrl + '/reveal/' + id );
	}
}
