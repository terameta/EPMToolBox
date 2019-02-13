import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable( { providedIn: 'root' } )
export class DimeUIBackend {
	private baseUrl = '/api/dime/ui';

	constructor( private http: HttpClient ) { }
}

