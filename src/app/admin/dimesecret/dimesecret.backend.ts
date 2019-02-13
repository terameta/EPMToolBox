import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DimeSecret } from '../../../../shared/model/secret';

@Injectable( {	providedIn: 'root' } )
export class DimeSecretBackend {
	private baseUrl = '/api/dime/secret';

	constructor( private http: HttpClient ) { }

	public allLoad = () => this.http.get<DimeSecret[]>( this.baseUrl );
	public oneCreate = ( payload: DimeSecret ) => this.http.post<DimeSecret>( this.baseUrl, payload );
	public oneLoad = ( id: number ) => this.http.get<DimeSecret>( this.baseUrl + '/' + id );
	public oneUpdate = ( payload: DimeSecret ) => this.http.put( this.baseUrl, payload );
	public oneDelete = ( id: number ) => this.http.delete( this.baseUrl + '/' + id );
}
