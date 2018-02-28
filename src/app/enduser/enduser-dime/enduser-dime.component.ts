import { AcmUserService } from '../../accessmanagement/acmuser/acmuser.service';
import { DimeProcessService } from '../../dime/dimeprocess/dimeprocess.service';
import { AuthService } from '../../welcome/auth.service';

import { Component, OnInit } from '@angular/core';
// import { AuthHttp } from 'angular2-jwt';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { AppState } from '../../ngstore/models';
import { DimeProcessActions } from '../../dime/dimeprocess/dimeprocess.actions';
import { DimeProcessBackend } from '../../dime/dimeprocess/dimeprocess.backend';
import { DimeProcessStatus, DimeProcess } from '../../../../shared/model/dime/process';

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
		private processService: DimeProcessService,
		private processBackend: DimeProcessBackend,
		private store: Store<AppState>
	) { }

	ngOnInit() {
		setTimeout( () => {
			this.store.dispatch( DimeProcessActions.ALL.LOAD.INITIATEIFEMPTY.action() );
		}, 1000 );
		this.currentUser = this.authService.getCurrentUser();
		this.userService.fetchUserRights( this.currentUser.id ).
			subscribe( ( data ) => {
				this.userProcesses = data.processes;
				this.prepareProcesses();
			}, ( error ) => {
				console.error( error );
			} );
	}
	private prepareProcesses = () => {
		this.userProcessDetails = [];
		this.store.select( 'dimeProcess' ).subscribe( processState => {
			this.userProcessDetails = [];
			processState.ids.filter( id => this.userProcesses.findIndex( e => e.process === id ) >= 0 ).forEach( id => {
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
