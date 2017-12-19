import { ActivatedRoute, Router, Params } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Rx';

import { DimeEnvironmentService } from '../dimeenvironment.service';
import { DimeTagService } from 'app/dime/dimetag/dimetag.service';
import { Store } from '@ngrx/store';
import { AppState } from 'app/ngstore/models';
import { DimeEnvironmentActions } from 'app/dime/dimeenvironment/dimeenvironment.actions';
import { DimeCredentialService } from 'app/dime/dimecredential/dimecredential.service';
import { DimeCredentialActions } from 'app/dime/dimecredential/dimecredential.actions';

// import { DimeEnvironment } from "../../../../../../shared/model/dime/environment";

@Component( {
	selector: 'app-dimeenvironment-detail',
	templateUrl: './dimeenvironment-detail.component.html',
	styleUrls: ['./dimeenvironment-detail.component.css']
} )
export class DimeenvironmentDetailComponent implements OnInit, OnDestroy {
	// curItem: Environment;
	// paramsSubscription: Subscription;

	// curEnvironmentID: number;
	// curEnvironment: any = {};

	constructor(
		private route: ActivatedRoute,
		public mainService: DimeEnvironmentService,
		public tagService: DimeTagService,
		public credentialService: DimeCredentialService,
		private store: Store<AppState>
	) { }

	ngOnInit() {
		this.store.dispatch( DimeCredentialActions.ALL.LOAD.initiateifempty() );
	}

	ngOnDestroy() {
		this.store.dispatch( DimeEnvironmentActions.ONE.unload() );
	}

	public decideColWidth = ( numCols: number ) => {
		let colWidth = 12;
		if ( numCols > 0 ) {
			colWidth = Math.floor( colWidth / numCols );
		}
		if ( colWidth < 1 ) { colWidth = 1; }
		return colWidth;
	}
}
