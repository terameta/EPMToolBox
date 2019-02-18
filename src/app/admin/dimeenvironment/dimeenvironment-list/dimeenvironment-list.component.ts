import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { DimeEnvironmentService } from '../dimeenvironment.service';
import { DimeTagService } from '../../dimetag/dimetag.service';
import { DimeUIService } from '../../../ngstore/uistate.service';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../app.state';

@Component( {
	selector: 'app-dimeenvironment-list',
	templateUrl: './dimeenvironment-list.component.html',
	styleUrls: ['./dimeenvironment-list.component.css']
} )
export class DimeenvironmentListComponent implements OnInit {
	// public tagState$ = this.store.pipe( select( 'central' ) );
	public credentialState$ = this.store.pipe( select( 'credential' ) );

	constructor(
		public mainService: DimeEnvironmentService,
		public tagService: DimeTagService,
		public uiService: DimeUIService,
		private store: Store<AppState>
	) { }

	ngOnInit() {
	}

	public shouldListItem = ( itemID: number ) => {
		let shouldShow = true;
		this.tagService.groupList.forEach( ( curGroup ) => {
			if ( this.uiService.uiState.selectedTags[curGroup.id] > 0 ) {
				if ( !this.mainService.itemObject[itemID].tags[this.uiService.uiState.selectedTags[curGroup.id]] ) {
					shouldShow = false;
				}
			}
		} );
		return shouldShow;
	}
}
