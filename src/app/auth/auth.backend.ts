import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthRequest, AuthResponse } from '../../../shared/models/auth';

@Injectable( { providedIn: 'root' } )
export class BackEnd {
	private baseUrl = '/api/auth';

	constructor( private http: HttpClient ) { }

	public signin = ( payload: AuthRequest ) => this.http.post<AuthResponse>( `${ this.baseUrl }/signin`, payload );

}
