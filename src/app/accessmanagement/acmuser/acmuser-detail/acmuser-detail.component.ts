import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { AuthService } from '../../../welcome/auth.service';

import { DimeProcessService } from '../../../dime/dimeprocess/dimeprocess.service';

import { AcmUserService } from '../acmuser.service';
import { AcmServerService } from '../../acmserver/acmserver.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../ngstore/models';
import { DimeProcessActions } from '../../../dime/dimeprocess/dimeprocess.actions';
import { DimeStreamActions } from '../../../dime/dimestream/dimestream.actions';
import * as _ from 'lodash';
import { SortByName } from '../../../../../shared/utilities/utilityFunctions';

@Component( {
	selector: 'app-acmuser-detail',
	templateUrl: './acmuser-detail.component.html',
	styleUrls: ['./acmuser-detail.component.css']
} )
export class AcmUserDetailComponent implements OnInit, OnDestroy {
	paramsSubscription: Subscription;
	public assignedProcesses: any[] = [];
	public availableStreams: any[] = [];

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		public mainService: AcmUserService,
		public serverService: AcmServerService,
		public dimeProcessService: DimeProcessService,
		private toastr: ToastrService,
		private store: Store<AppState>
	) { }

	ngOnInit() {
		this.paramsSubscription = this.route.params.subscribe(
			( params: Params ) => {
				this.mainService.getOne( params['id'] );
			}
		);
		this.store.dispatch( DimeProcessActions.ALL.LOAD.INITIATEIFEMPTY.action() );
		this.store.dispatch( DimeStreamActions.ALL.LOAD.initiateifempty() );
		this.store.select( 'dimeProcess' ).subscribe( processState => {
			processState.ids.forEach( processid => {
				let toPush: any; toPush = {};
				toPush.id = processid;
				toPush.name = processState.items[processid].name;
				toPush.isAssigned = false;
				this.assignedProcesses.push( toPush );
			} );
			this.populateAccessRights();
		}, error => {
			this.toastr.error( 'Failed to receive processes' );
		} );
		this.store.select( 'dimeStream' ).subscribe( streamState => {
			this.availableStreams = _.values( streamState.items ).sort( SortByName );
			this.populateAccessRights();
		} );
	}

	ngOnDestroy() {
		this.paramsSubscription.unsubscribe();
	}

	public onEmailChange = () => {
		if ( this.mainService.curItem.type === 'directory' ) {
			this.mainService.curItem.username = this.mainService.curItem.email;
		}
	}
	private populateAccessRights = () => {
		if ( !this.mainService.curItem.clearance ) {
			setTimeout( this.populateAccessRights, 1000 );
		} else {
			if ( !this.mainService.curItem.clearance.processes ) this.mainService.curItem.clearance.processes = [];
			this.assignedProcesses.forEach( availableProcess => {
				this.mainService.curItem.clearance.processes.forEach( ( assignedProcess ) => {
					if ( availableProcess.id === assignedProcess.id ) availableProcess.isAssigned = true;
				} );
			} );
			if ( !this.mainService.curItem.clearance.streamExports ) this.mainService.curItem.clearance.streamExports = [];
			this.availableStreams.forEach( stream => {
				stream.exports.forEach( ex => {
					this.mainService.curItem.clearance.streamExports.forEach( assignedStreamExports => {
						if ( assignedStreamExports.id === ex.id && assignedStreamExports.stream === stream.id ) {
							ex.isAssigned = true;
						}
					} );
				} );
			} );
		}
	}
	public processAccessRightChange = () => {
		this.mainService.curItem.clearance.processes = [];
		this.assignedProcesses.forEach( ( curAssignedProcess ) => {
			if ( curAssignedProcess.isAssigned && !this.mainService.curItem.clearance.processes.find( e => e.id === curAssignedProcess.id ) ) {
				this.mainService.curItem.clearance.processes.push( { id: curAssignedProcess.id } );
			}
		} );

	}
	public streamExportAccessRightChange = () => {
		this.mainService.curItem.clearance.streamExports = [];
		this.availableStreams.forEach( stream => {
			stream.exports.forEach( ex => {
				if ( ex.isAssigned && !this.mainService.curItem.clearance.streamExports.find( e => ( e.id === ex.id && e.stream === stream.id ) ) ) {
					this.mainService.curItem.clearance.streamExports.push( { id: ex.id, stream: stream.id } );
				}
			} );
		} );
	}
}
