import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { User } from "../../../../shared/models/user";

@Injectable( { providedIn: 'root' } )
export class BackEnd {
	private baseUrl = '/api/users';

	constructor( private http: HttpClient ) { }

	public create = ( payload: User ) => this.http.post<User>( `${ this.baseUrl }`, payload );
	public load = () => this.http.get<User[]>( `${ this.baseUrl }` );
	public update = ( payload: User ) => this.http.patch<User>( `${ this.baseUrl }`, payload );
	public delete = ( payload: number ) => this.http.delete( `${ this.baseUrl }/${ payload }` );
}
