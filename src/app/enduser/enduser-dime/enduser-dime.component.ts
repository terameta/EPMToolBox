import { AcmUserService } from '../../accessmanagement/acmuser/acmuser.service';
import { AuthService } from '../../auth/auth.service';

import { Component, OnInit } from '@angular/core';
// import { AuthHttp } from 'angular2-jwt';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { DimeProcessStatus, DimeProcess } from '../../../../shared/model/dime/process';
import * as _ from 'lodash';
import { DimeProcessService } from '../../admin/dimeprocess/dimeprocess.service';
import { DimeProcessBackend } from '../../admin/dimeprocess/dimeprocess.backend';
import { DimeStreamService } from '../../admin/dimestream/dimestream.service';
import { DimeStreamBackend } from '../../admin/dimestream/dimestream.backend';
import { DimeProcessActions } from '../../admin/dimeprocess/dimeprocess.actions';
import { DimeStreamActions } from '../../admin/dimestream/dimestream.actions';
import { AppState } from '../../app.state';

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
		// private authHttp: AuthHttp,
		private toastr: ToastrService,
		public processService: DimeProcessService,
		private processBackend: DimeProcessBackend,
		public streamService: DimeStreamService,
		private streamBackend: DimeStreamBackend,
		private store: Store<AppState>
	) { }

	ngOnInit() {
		setTimeout( () => {
			this.store.dispatch( DimeProcessActions.ALL.LOAD.INITIATEIFEMPTY.action() );
			this.store.dispatch( DimeStreamActions.ALL.LOAD.initiateifempty() );
		}, 1000 );
		this.currentUser = this.authService.getCurrentUser();
		if ( !this.currentUser.clearance ) this.currentUser.clearance = {};
		if ( typeof this.currentUser.clearance === 'string' ) this.currentUser.clearance = JSON.parse( this.currentUser.clearance );
		if ( !this.currentUser.clearance.processes ) this.currentUser.clearance.processes = [];
		if ( !this.currentUser.clearance.streamExports ) this.currentUser.clearance.streamExports = [];

		this.prepareProcesses();
	}
	public isStreamExportAssigned = ( streamid: number, exportid: number ) => {
		return this.currentUser.clearance.streamExports.findIndex( e => e.stream === streamid && e.id === exportid ) >= 0;
	}
	public initiateExport = ( streamid: number, exportid: number ) => {
		this.toastr.info( 'Initiating the stream data export' );
		this.streamBackend.executeExport( { streamid, exportid } ).subscribe( result => {
			this.toastr.success( 'Stream data export is initiated. Please check your inbox after a couple of minutes.' );
		}, error => {
			this.toastr.error( 'Failed to initiate the stream data export' );
			console.error( error );
		} );
	}
	private prepareProcesses = () => {
		this.userProcessDetails = [];
		this.store.select( 'dimeProcess' ).subscribe( processState => {
			this.userProcessDetails = [];
			processState.ids.filter( id => this.currentUser.clearance.processes.findIndex( e => e.id === id ) >= 0 ).forEach( id => {
				const toPush: DimeProcess = JSON.parse( JSON.stringify( processState.items[id] ) );
				this.userProcessDetails.push( toPush );
				this.processBackend.filtersLoad( id ).subscribe( filters => {
					toPush.filters = filters;
				}, error => {
					this.toastr.error( 'Failed to get processes' );
				} );
			} );
			this.userProcessDetails.forEach( p => {
				if ( p.status === DimeProcessStatus.Running ) {
					this.checkLog( p.id, p.currentlog );
				}
			} );
		} );
	}
	public checkLog = ( process: number, log: number ) => {
		this.processBackend.checkLog( log ).subscribe( result => {
			this.setProcessLog( process, result.details, log );
			if ( result.start.toString() === result.end.toString() ) {
				setTimeout( () => {
					this.checkLog( process, log );
				}, 2000 );
			} else {
				this.store.dispatch( DimeProcessActions.ALL.LOAD.INITIATE.action() );
			}
		}, error => {
			this.toastr.error( 'Failed to retrieve log records.' );
			console.error( error );
			setTimeout( () => {
				this.checkLog( process, log );
			}, 2000 );
		} );
	}
	private setProcessLog = ( process: number, log: string, logID: number ) => {
		this.userProcessDetails.forEach( ( curUserProcess ) => {
			if ( curUserProcess.id === process ) {
				curUserProcess.log = log;
				curUserProcess.currentlog = logID;
			}
		} );
	}
	public processRun = ( id: number ) => {
		this.toastr.info( 'Initiating the process' );
		this.processBackend.run( id ).subscribe( result => {
			this.toastr.success( 'Process is initiated' );
			this.store.dispatch( DimeProcessActions.ALL.LOAD.INITIATE.action() );
		}, error => {
			this.toastr.error( 'Failed to initiate the process.' );
			console.error( error );
		} );
	}
}
