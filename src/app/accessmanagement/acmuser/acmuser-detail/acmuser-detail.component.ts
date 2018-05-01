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
			console.log( streamState );
			this.availableStreams = _.values( streamState.items ).sort( SortByName );
			console.log( this.availableStreams );
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
		if ( Object.keys( this.mainService.curItemAccessRights ).length === 0 ) {
			setTimeout( this.populateAccessRights, 1000 );
		} else {
			this.mainService.curItemAccessRights.processes.forEach( ( curProcess ) => {
				this.assignedProcesses.forEach( ( curAssignedProcess ) => {
					curAssignedProcess.user = this.mainService.curItem.id;
					console.log( curProcess.id, curProcess );
					if ( curAssignedProcess.id === curProcess.process ) {
						curAssignedProcess.isAssigned = true;
					}
				} );
			} );
			this.assignedProcesses.forEach( ( curAssignedProcess ) => {
				curAssignedProcess.user = this.mainService.curItem.id;
			} );
		}
	}
	public processAccessRightChange = () => {
		this.mainService.curItemAccessRights.processes = [];
		this.assignedProcesses.forEach( ( curAssignedProcess ) => {
			if ( curAssignedProcess.isAssigned ) {
				this.mainService.curItemAccessRights.processes.push( { user: curAssignedProcess.user, process: curAssignedProcess.id } );
			}
		} );

	}
	public streamExportAccessRightChange = () => {
		this.mainService.curItemAccessRights.streamExports = [];
		this.availableStreams.forEach( stream => {
			stream.exports.forEach( ex => {
				if ( ex.isAssigned ) {
					this.mainService.curItemAccessRights.streamExports.push( { user: this.mainService.curItem.id, stream: stream.id, export: ex.id } );
				}
			} );
		} );
	}
}
