import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { DimeTag } from '../../../../shared/model/dime/tag';

@Injectable()
export class DimeTagBackend {
	private baseUrl = '/api/dime/tag';

	constructor( private http: HttpClient ) { }

	public allLoad = (): Observable<DimeTag[]> => {
		return this.http.get<DimeTag[]>( this.baseUrl );
	}

	public oneLoad = ( id: number ): Observable<DimeTag> => {
		return this.http.get<DimeTag>( this.baseUrl + '/' + id );
	}

	public oneCreate = ( refItem: DimeTag ): Observable<DimeTag> => {
		return this.http.post<DimeTag>( this.baseUrl, refItem );
	}

	public oneUpdate = ( refItem: DimeTag ): Observable<DimeTag> => {
		return this.http.put<DimeTag>( this.baseUrl, refItem );
	}

	public oneDelete = ( id: number ) => {
		return this.http.delete( this.baseUrl + '/' + id );
	}
}
