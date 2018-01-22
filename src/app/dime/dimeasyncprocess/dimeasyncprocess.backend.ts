import { DimeAsyncProcess } from '../../../../shared/model/dime/asyncprocess';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class DimeAsyncProcessBackend {
	private baseUrl = '/api/dime/asyncprocess';

	constructor( private http: HttpClient ) { }

	allLoad = (): Observable<DimeAsyncProcess[]> => {
		return this.http.get<DimeAsyncProcess[]>( this.baseUrl + '/' );
	}
	oneLoad = ( id: number ): Observable<DimeAsyncProcess> => {
		return this.http.get<DimeAsyncProcess>( this.baseUrl + '/' + id );
	}
	oneCreate = ( refObj: DimeAsyncProcess ): Observable<DimeAsyncProcess> => {
		return this.http.post<DimeAsyncProcess>( this.baseUrl, refObj );
	}
}
