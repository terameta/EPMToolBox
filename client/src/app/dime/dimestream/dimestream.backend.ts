import { DimeStream } from '../../../../../shared/model/dime/stream';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DimeStreamBackend {
	private baseUrl = '/api/dime/stream';

	constructor( private http: HttpClient ) { }

	allLoad = (): Observable<DimeStream[]> => {
		return this.http.get<DimeStream[]>( this.baseUrl );
	}
}
