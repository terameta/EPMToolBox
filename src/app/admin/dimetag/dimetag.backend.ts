import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Tag } from '../../../../shared/model/dime/tag';

@Injectable( { providedIn: 'root' } )
export class DimeTagBackend {
	private baseUrl = '/api/dime/tag';

	constructor( private http: HttpClient ) { }

	public allLoad = (): Observable<Tag[]> => {
		return this.http.get<Tag[]>( this.baseUrl );
	}

	public oneLoad = ( id: number ): Observable<Tag> => {
		return this.http.get<Tag>( this.baseUrl + '/' + id );
	}

	public oneCreate = ( refItem: Tag ): Observable<Tag> => {
		return this.http.post<Tag>( this.baseUrl, refItem );
	}

	public oneUpdate = ( refItem: Tag ): Observable<Tag> => {
		return this.http.put<Tag>( this.baseUrl, refItem );
	}

	public oneDelete = ( id: number ) => {
		return this.http.delete( this.baseUrl + '/' + id );
	}
}
