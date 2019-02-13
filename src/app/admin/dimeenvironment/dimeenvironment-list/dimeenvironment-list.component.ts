import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { DimeEnvironmentService } from '../dimeenvironment.service';
import { DimeTagService } from '../../dimetag/dimetag.service';
import { DimeUIService } from '../../../ngstore/uistate.service';

@Component( {
	selector: 'app-dimeenvironment-list',
	templateUrl: './dimeenvironment-list.component.html',
	styleUrls: ['./dimeenvironment-list.component.css']
} )
export class DimeenvironmentListComponent implements OnInit {

	constructor( public mainService: DimeEnvironmentService, public tagService: DimeTagService, public uiService: DimeUIService ) { }

	ngOnInit() {
	}

	public shouldListItem = ( itemID: number ) => {
		let shouldShow = true;
		this.tagService.groupList.forEach( ( curGroup ) => {
			if ( parseInt( this.uiService.uiState.selectedTags[curGroup.id], 10 ) > 0 ) {
				if ( !this.mainService.itemObject[itemID].tags[this.uiService.uiState.selectedTags[curGroup.id]] ) {
					shouldShow = false;
				}
			}
		} );
		return shouldShow;
	}
}
