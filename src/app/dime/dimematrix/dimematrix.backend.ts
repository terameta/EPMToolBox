import { of } from 'rxjs/observable/of';
import { DimeMatrix } from '../../../../shared/model/dime/matrix';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable()
export class DimeMatrixBackend {
	private baseUrl = '/api/dime/matrix';

	constructor( private http: HttpClient ) { }

	public allLoad = (): Observable<DimeMatrix[]> => {
		return this.http.get<DimeMatrix[]>( this.baseUrl );
	}

	public oneCreate = ( refObj: DimeMatrix ): Observable<DimeMatrix> => {
		return this.http.post<DimeMatrix>( this.baseUrl, refObj );
	}

	public oneLoad = ( id: number ): Observable<DimeMatrix> => {
		return this.http.get<DimeMatrix>( this.baseUrl + '/' + id );
	}

	public oneDelete = ( id: number ) => {
		return this.http.delete( this.baseUrl + '/' + id );
	}

	public oneUpdate = ( refObj: DimeMatrix ) => {
		return this.http.put( this.baseUrl, refObj );
	}
}
