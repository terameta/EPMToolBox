import { Component, OnInit } from '@angular/core';

import { DimeMapService } from '../dimemap.service';
import { DimeStreamService } from '../../dimestream/dimestream.service';
import { DimeUIService } from '../../../ngstore/uistate.service';
import { DimeTagService } from '../../dimetag/dimetag.service';

@Component( {
	selector: 'app-dimemap-list',
	templateUrl: './dimemap-list.component.html',
	styleUrls: ['./dimemap-list.component.css']
} )
export class DimemapListComponent implements OnInit {

	constructor(
		public mainService: DimeMapService,
		public streamService: DimeStreamService,
		private uiService: DimeUIService,
		private tagService: DimeTagService
	) { }

	ngOnInit() {
	}

	public shouldListItem = ( itemid: number ) => {
		let shouldShow = true;
		this.tagService.groupList.forEach( ( curGroup ) => {
			if ( this.uiService.uiState.selectedTags[curGroup.id] > 0 ) {
				if ( !this.mainService.itemObject[itemid].tags[this.uiService.uiState.selectedTags[curGroup.id]] ) {
					shouldShow = false;
				}
			}
		} );
		return shouldShow;
	}
}
