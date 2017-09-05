import { AcmUserService } from '../../accessmanagement/acmuser/acmuser.service';
import { DimeProcessService } from '../../dime/dimeprocess/dimeprocess.service';
import { AuthService } from '../../welcome/auth.service';

import { Component, OnInit } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { ToastrService } from 'ngx-toastr';

@Component( {
	selector: 'app-enduser-dime',
	templateUrl: './enduser-dime.component.html',
	styleUrls: ['./enduser-dime.component.css']
} )
export class EnduserDimeComponent implements OnInit {
	private currentUser;
	private userProcesses: any[];
	public userProcessDetails: any[];

	constructor(
		private authService: AuthService,
		private userService: AcmUserService,
		private authHttp: AuthHttp,
		private toastr: ToastrService,
		private processService: DimeProcessService
	) { }

	ngOnInit() {
		this.currentUser = this.authService.getCurrentUser();
		this.userService.fetchUserRights( this.currentUser.id ).
			subscribe(( data ) => {
				this.userProcesses = data.processes;
				this.prepareProcesses();
			}, ( error ) => {
				console.error( error );
			} );
	}
	private prepareProcesses = () => {
		this.userProcessDetails = [];
		this.userProcesses.forEach(( curProcess ) => {
			this.processService.fetchOne( curProcess.process ).
				subscribe(( data ) => {
					this.userProcessDetails.push( data );
					if ( data.status !== 'ready' ) {
						this.checkLog( data.id, data.status );
					}
					this.processService.fetchFiltersFetch( curProcess.process ).
						subscribe(( filterdata ) => {
							data.filters = filterdata;
						}, ( error ) => {
							this.toastr.error( 'Failed to get process filters' + curProcess.process );
						} );
				}, ( error ) => {
					this.toastr.error( 'Failed to get process' + curProcess.process );
				} );
		} );
	};
	public processRun = ( id: number ) => {
		this.authHttp.get( '/api/dime/process/run/' + id ).
			map( response => response.json() ).
			subscribe(( result ) => {
				this.setProcessLog( id, '', result.status );
				this.checkLog( id, result.status );
			}, ( error ) => {
				this.toastr.error( 'Failed to initiate the night run.' );
				console.error( error );
			} );
	}
	public checkLog = ( process: number, log: number ) => {
		this.authHttp.get( '/api/log/' + log ).
			map( response => response.json() ).
			subscribe(( result ) => {
				this.setProcessLog( process, result.details, log );
				if ( result.start === result.end ) {
					setTimeout(() => {
						this.checkLog( process, log );
					}, 2000 );
				} else {
					this.prepareProcesses();
				}
			}, ( error ) => {
				this.toastr.error( 'Failed to retrieve log records.' );
				console.error( error );
				setTimeout(() => {
					this.checkLog( process, log );
				}, 2000 );
			} );
	};
	private setProcessLog = ( process: number, log: string, logID: number ) => {
		this.userProcessDetails.forEach(( curUserProcess ) => {
			if ( curUserProcess.id === process ) {
				curUserProcess.log = log;
				curUserProcess.status = logID;
			}
		} );
	}
}
