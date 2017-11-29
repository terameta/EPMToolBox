import { DimeMatrix } from '../../../../../shared/model/dime/matrix';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable()
export class DimeMatrixBackend {
	private baseUrl = '/api/dime/matrix';

	constructor( private http: HttpClient ) { }

	allLoad = (): Observable<DimeMatrix[]> => {
		return this.http.get<DimeMatrix[]>( this.baseUrl );
	}

	oneCreate = ( refObj: DimeMatrix ): Observable<DimeMatrix> => {
		return this.http.post<DimeMatrix>( this.baseUrl, refObj );
	}
}
