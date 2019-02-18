import { Component, OnDestroy, OnInit } from '@angular/core';
import * as _ from 'lodash';

import { DimeMatrixService } from '../dimematrix.service';
import { DimeMapService } from '../../dimemap/dimemap.service';
import { DimeStreamService } from '../../dimestream/dimestream.service';
import { DimeUIService } from '../../../ngstore/uistate.service';
import { DimeTagService } from '../../dimetag/dimetag.service';

@Component( {
	selector: 'app-dimematrix-list',
	templateUrl: './dimematrix-list.component.html',
	styleUrls: ['./dimematrix-list.component.css']
} )
export class DimeMatrixListComponent implements OnInit, OnDestroy {

	constructor(
		public mainService: DimeMatrixService,
		public streamService: DimeStreamService,
		private uiService: DimeUIService,
		private tagService: DimeTagService
	) { }

	ngOnInit() {
	}

	ngOnDestroy() {
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
