import { Component, OnInit } from '@angular/core';
import { DimeCredentialService } from '../dimecredential.service';
import { DimeUIService } from '../../../ngstore/uistate.service';
import { DimeTagService } from '../../dimetag/dimetag.service';

@Component( {
	selector: 'app-dimecredential-list',
	templateUrl: './dimecredential-list.component.html',
	styleUrls: ['./dimecredential-list.component.css']
} )
export class DimeCredentialListComponent implements OnInit {

	constructor( public mainService: DimeCredentialService, public uiService: DimeUIService, public tagService: DimeTagService ) { }

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
