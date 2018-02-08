import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DimeProcess, DimeProcessStep } from '../../../../shared/model/dime/process';
import { IsReadyPayload } from '../../../../shared/enums/generic/readiness';

@Injectable()
export class DimeProcessBackend {
	private baseUrl = '/api/dime/process';

	constructor( private http: HttpClient ) { }

	public allLoad = () => this.http.get<DimeProcess[]>( this.baseUrl );
	public oneCreate = ( payload: DimeProcess ) => this.http.post<DimeProcess>( this.baseUrl, payload );
	public oneLoad = ( id: number ) => this.http.get<DimeProcess>( this.baseUrl + '/' + id );
	public oneUpdate = ( payload: DimeProcess ) => this.http.put( this.baseUrl, payload );
	public oneDelete = ( id: number ) => this.http.delete( this.baseUrl + '/' + id );
	public isPrepared = ( id: number ) => this.http.get<IsReadyPayload>( this.baseUrl + '/isPrepared/' + id );
	public stepLoadAll = ( id: number ) => this.http.get<DimeProcessStep[]>( this.baseUrl + '/steps/' + id );
	public stepUpdateAll = ( id: number, steps: DimeProcessStep[] ) => this.http.put<DimeProcessStep[]>( this.baseUrl + '/steps/' + id, steps );
	public stepCreate = ( step: DimeProcessStep ) => this.http.post( this.baseUrl + '/step', step );
	public stepUpdate = ( step: DimeProcessStep ) => this.http.put( this.baseUrl + '/step', step );
	public stepDelete = ( id: number ) => this.http.delete( this.baseUrl + '/step/' + id );

}
