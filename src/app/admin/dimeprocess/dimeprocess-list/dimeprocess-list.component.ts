import { Component, OnInit } from '@angular/core';

import { DimeProcessService } from '../dimeprocess.service';
import { DimeEnvironmentService } from '../../dimeenvironment/dimeenvironment.service';
import { DimeTagService } from '../../dimetag/dimetag.service';
import { DimeUIService } from '../../../ngstore/uistate.service';
import { DimeProcessStatus } from '../../../../../shared/model/dime/process';

@Component( {
	selector: 'app-dimeprocess-list',
	templateUrl: './dimeprocess-list.component.html',
	styleUrls: ['./dimeprocess-list.component.css']
} )
export class DimeprocessListComponent implements OnInit {
	public dimeProcessStatus = DimeProcessStatus;

	constructor(
		public mainService: DimeProcessService,
		public environmentService: DimeEnvironmentService,
		public tagService: DimeTagService,
		public uiService: DimeUIService
	) { }

	ngOnInit() {
	}

	public shouldListItem = ( itemid: number ) => {
		let shouldShow = true;
		this.tagService.groupList.forEach( ( curGroup ) => {
			if ( parseInt( this.uiService.uiState.selectedTags[curGroup.id], 10 ) > 0 ) {
				if ( !this.mainService.items[itemid].tags[this.uiService.uiState.selectedTags[curGroup.id]] ) {
					shouldShow = false;
				}
			}
		} );
		return shouldShow;
	}
}
