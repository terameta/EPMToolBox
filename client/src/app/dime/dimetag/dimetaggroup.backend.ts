import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { DimeTagGroup } from '../../../../../shared/model/dime/taggroup';

@Injectable()
export class DimeTagGroupBackend {
	private baseUrl = '/api/dime/taggroup';

	constructor( private http: HttpClient ) { }

	public allLoad = (): Observable<DimeTagGroup[]> => {
		return this.http.get<DimeTagGroup[]>( this.baseUrl );
	}

	public oneLoad = ( id: number ): Observable<DimeTagGroup> => {
		return this.http.get<DimeTagGroup>( this.baseUrl + '/' + id );
	}

	public oneCreate = ( refItem: DimeTagGroup ): Observable<DimeTagGroup> => {
		return this.http.post<DimeTagGroup>( this.baseUrl, refItem );
	}

	public oneUpdate = ( refItem: DimeTagGroup ): Observable<DimeTagGroup> => {
		return this.http.put<DimeTagGroup>( this.baseUrl, refItem );
	}

	public oneDelete = ( id: number ) => {
		return this.http.delete( this.baseUrl + '/' + id );
	}
}
