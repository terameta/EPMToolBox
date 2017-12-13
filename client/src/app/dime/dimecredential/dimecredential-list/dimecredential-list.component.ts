import { Component, OnInit } from '@angular/core';
import { DimeCredentialService } from 'app/dime/dimecredential/dimecredential.service';
import { DimeUIService } from 'app/ngstore/uistate.service';
import { DimeTagService } from 'app/dime/dimetag/dimetag.service';

@Component( {
	selector: 'app-dimecredential-list',
	templateUrl: './dimecredential-list.component.html',
	styleUrls: ['./dimecredential-list.component.css']
} )
export class DimeCredentialListComponent implements OnInit {

	constructor( public mainService: DimeCredentialService, public uiService: DimeUIService, public tagService: DimeTagService ) { }

	ngOnInit() {
	}

	public shouldListItem = ( credentialID: number ) => {
		let shouldShow = true;
		this.tagService.groupList.forEach( ( curGroup ) => {
			if ( parseInt( this.uiService.uiState.selectedTags[curGroup.id], 10 ) > 0 ) {
				if ( !this.mainService.itemObject[credentialID].tags[this.uiService.uiState.selectedTags[curGroup.id]] ) {
					shouldShow = false;
				}
			}
		} );
		return shouldShow;
	}

}
