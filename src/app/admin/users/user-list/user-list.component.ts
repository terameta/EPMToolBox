import { Component, OnInit } from '@angular/core';
import { select } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { Service } from '../users.service';
import { DimeTagService } from '../../dimetag/dimetag.service';
import { DimeUIService } from '../../../ngstore/uistate.service';
import { User, UserType, UserRole } from '../../../../../shared/models/user';
import { enum2array } from '../../../../../shared/utilities/utilityFunctions';

@Component( {
	selector: 'app-user-list',
	templateUrl: './user-list.component.html',
	styleUrls: ['./user-list.component.scss']
} )
export class UserListComponent implements OnInit {
	public types = enum2array( UserType );
	public roles = enum2array( UserRole );
	public state$ = this.srvc.store.pipe(
		select( 'users' ),
		filter( state => state.loaded )
	);

	constructor( public srvc: Service, private tagService: DimeTagService, private uiService: DimeUIService ) { }

	ngOnInit() { }

	public shouldListItem = ( item: User ) => {
		let shouldShow = true;
		this.tagService.groupList.forEach( ( curGroup ) => {
			if ( this.uiService.uiState.selectedTags[curGroup.id] > 0 ) {
				if ( item.tags[this.uiService.uiState.selectedTags[curGroup.id]] ) {
					shouldShow = false;
				}
			}
		} );
		return shouldShow;
	}


}
