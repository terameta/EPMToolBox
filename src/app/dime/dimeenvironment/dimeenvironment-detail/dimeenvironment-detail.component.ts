import { ActivatedRoute, Router, Params } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Observable } from 'rxjs';

import { DimeEnvironmentService } from '../dimeenvironment.service';
import { DimeTagService } from '../../dimetag/dimetag.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../ngstore/models';
import { DimeEnvironmentActions } from '../dimeenvironment.actions';
import { DimeCredentialService } from '../../dimecredential/dimecredential.service';
import { DimeCredentialActions } from '../../dimecredential/dimecredential.actions';

@Component( {
	selector: 'app-dimeenvironment-detail',
	templateUrl: './dimeenvironment-detail.component.html',
	styleUrls: ['./dimeenvironment-detail.component.css']
} )
export class DimeenvironmentDetailComponent implements OnInit, OnDestroy {

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
