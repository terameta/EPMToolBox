import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TagGroup } from '../../../../shared/model/dime/taggroup';

@Injectable( { providedIn: 'root' } )
export class DimeTagGroupBackend {
	private baseUrl = '/api/dime/taggroup';

	constructor( private http: HttpClient ) { }

	public allLoad = (): Observable<TagGroup[]> => {
		return this.http.get<TagGroup[]>( this.baseUrl );
	}

	public oneLoad = ( id: number ): Observable<TagGroup> => {
		return this.http.get<TagGroup>( this.baseUrl + '/' + id );
	}

	public oneCreate = ( refItem: TagGroup ): Observable<TagGroup> => {
		return this.http.post<TagGroup>( this.baseUrl, refItem );
	}

	public oneUpdate = ( refItem: TagGroup ): Observable<TagGroup> => {
		return this.http.put<TagGroup>( this.baseUrl, refItem );
	}

	public oneDelete = ( id: number ) => {
		return this.http.delete( this.baseUrl + '/' + id );
	}
}
