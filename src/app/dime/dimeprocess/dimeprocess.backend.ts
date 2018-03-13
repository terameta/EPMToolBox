import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DimeProcess, DimeProcessStep, DimeProcessRunning } from '../../../../shared/model/dime/process';
import { IsReadyPayload } from '../../../../shared/enums/generic/readiness';
import { DimeLog } from '../../../../shared/model/dime/log';

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
	public defaultTargetsLoad = ( id: number ) => this.http.get<any[]>( this.baseUrl + '/defaultTargets/' + id );
	public defaultTargetsUpdate = ( payload: { id: number, targets: any[] } ) => this.http.put( this.baseUrl + '/defaultTargets/' + payload.id, payload.targets );
	public filtersLoad = ( id: number ) => this.http.get<any[]>( this.baseUrl + '/filters/' + id );
	public filtersUpdate = ( payload: { id: number, filters: any[] } ) => this.http.put( this.baseUrl + '/filters/' + payload.id, payload );
	public filtersDataFileLoad = ( id: number ) => this.http.get<any[]>( this.baseUrl + '/filtersdatafile/' + id );
	public filtersDataFileUpdate = ( payload: { id: number, filters: any[] } ) => this.http.put( this.baseUrl + '/filtersdatafile/' + payload.id, payload );

	public run = ( payload: number ) => this.http.get<DimeProcessRunning>( this.baseUrl + '/run/' + payload );
	public checkLog = ( payload: number ) => this.http.get<DimeLog>( '/api/log/' + payload );
	public unlock = ( payload: number ) => this.http.get( this.baseUrl + '/unlock/' + payload );
	public sendDataFile = ( payload: number ) => this.http.get( this.baseUrl + '/sendDataFile/' + payload );
	public getAllLogs = ( payload: number ) => this.http.get( '/api/log/getall/process/' + payload );

	/**
	 *
		public processRun = () => {
			this.authHttp.get( this.baseUrl + '/run/' + this.curItem.id ).
				map( response => response.json() ).
				subscribe(( result ) => {
					this.curItem.status = result.status;
					this.checkLog( result.status );
				}, ( error ) => {
					this.toastr.error( '', this.serviceName );
					console.error( error );
				} );
		}
		public checkLog = ( id: number ) => {
			this.authHttp.get( '/api/log/' + id ).
				map( response => response.json() ).
				subscribe(( result ) => {
					this.currentLog = result.details;
					if ( result.start === result.end ) {
						setTimeout(() => {
							this.checkLog( id );
						}, 2000 );
					}

				}, ( error ) => {
					this.toastr.error( 'Failed to retrieve log records.', this.serviceName );
					console.error( error );
				} );
		};
		public processUnlock = () => {
			if ( confirm( 'Are you sure you want to unlock the process? This does not cancel the running process.' ) ) {
				this.authHttp.get( this.baseUrl + '/unlock/' + this.curItem.id ).
					map( response => response.json() ).
					subscribe(( result ) => {
						this.toastr.info( 'Process unlocked successfully.', this.serviceName );
					}, ( error ) => {
						this.toastr.error( 'Unlocking process failed.', this.serviceName );
						console.error( error );
					} );
			} else {
				this.toastr.info( 'Unlock of process cancelled.', this.serviceName );
			}
		};
		public sendDataFile = ( id: number ) => {
			this.authHttp.get( this.baseUrl + '/sendDataFile/' + id ).
				map( response => response.json() ).
				subscribe(( result ) => {
					this.toastr.info( 'Process data file will be sent to your inbox.' );
				}, ( error ) => {
					this.toastr.error( 'Process file can not be send.', this.serviceName );
					console.error( error );
				} );
		}
	 */

}
