import { EnumToArray } from '../../../../../shared/utilities/utilityFunctions';
import { ATStatusType } from '../../../../../shared/enums/generic/statustypes';
import { DimeScheduleService } from '../dimeschedule.service';
import { Component, OnInit } from '@angular/core';
import { DimeUIService } from '../../../ngstore/uistate.service';
import { DimeTagService } from '../../dimetag/dimetag.service';

@Component( {
	selector: 'app-dimeschedule-list',
	templateUrl: './dimeschedule-list.component.html',
	styleUrls: ['./dimeschedule-list.component.css']
} )
export class DimescheduleListComponent implements OnInit {
	private statusTypeArray = EnumToArray( ATStatusType );

	constructor(
		public mainService: DimeScheduleService,
		public uiService: DimeUIService,
		public tagService: DimeTagService
	) {

	}

	ngOnInit() {
	}

	private findStatus = ( n ) => {
		let toReturn: string; toReturn = 'Unknown status';
		this.statusTypeArray.forEach( ( curStatus ) => {
			if ( curStatus.value === parseInt( n, 10 ) ) {
				toReturn = curStatus.label;
			}
		} );
		return toReturn;
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
