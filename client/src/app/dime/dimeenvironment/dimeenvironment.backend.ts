import { DimeEnvironment } from '../../../../../shared/model/dime/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DimeEnvironmentBackend {
	private baseUrl = '/api/dime/environment';

	constructor( private http: HttpClient ) { }

	allLoad = (): Observable<DimeEnvironment[]> => {
		return this.http.get<DimeEnvironment[]>( this.baseUrl );
	}
}
