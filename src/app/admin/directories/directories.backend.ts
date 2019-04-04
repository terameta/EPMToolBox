import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Directory } from "../../../../shared/models/directory";

@Injectable( { providedIn: 'root' } )
export class BackEnd {
	private baseUrl = '/api/directories';

	constructor( private http: HttpClient ) { }

	public create = ( payload: Directory ) => this.http.post<Directory>( `${ this.baseUrl }`, payload );
	public load = () => this.http.get<Directory[]>( `${ this.baseUrl }` );
	public update = ( payload: Directory ) => this.http.put<Directory>( `${ this.baseUrl }`, payload );
	public delete = ( payload: number ) => this.http.delete( `${ this.baseUrl }/${ payload }` );
}
