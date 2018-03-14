import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DimeSchedule } from '../../../../shared/model/dime/schedule';

@Injectable()
export class DimeScheduleBackend {
	private baseUrl = '/api/dime/schedule';

	constructor( private http: HttpClient ) { }

	public allLoad = () => this.http.get<DimeSchedule[]>( this.baseUrl );
	public oneCreate = ( payload: DimeSchedule ) => this.http.post<DimeSchedule>( this.baseUrl, payload );
	public oneLoad = ( id: number ) => this.http.get<DimeSchedule>( this.baseUrl + '/' + id );
	public oneUpdate = ( payload: DimeSchedule ) => this.http.put( this.baseUrl, payload );
	public oneDelete = ( id: number ) => this.http.delete( this.baseUrl + '/' + id );
	public unlock = ( payload: number ) => this.http.get( this.baseUrl + '/unlock/' + payload );
	public getAllLogs = ( payload: number ) => this.http.get( '/api/log/getall/schedule/' + payload );
}
