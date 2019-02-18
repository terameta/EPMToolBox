import { Component, OnInit } from '@angular/core';
import { DimeStreamService } from '../dimestream.service';
import { DimeUIService } from '../../../ngstore/uistate.service';
import { DimeTagService } from '../../dimetag/dimetag.service';
import { Store } from '@ngrx/store';
import { DimeEnvironmentActions } from '../../dimeenvironment/dimeenvironment.actions';
import { AppState } from '../../../app.state';
import { DimeEnvironmentService } from '../../dimeenvironment/dimeenvironment.service';

@Component( {
	selector: 'app-dimestream-list',
	templateUrl: './dimestream-list.component.html',
	styleUrls: ['./dimestream-list.component.css']
} )
export class DimeStreamListComponent implements OnInit {

	// streamList: any[];
	// streamTypeList: any[];
	// environmentList: any[];

	constructor(
		public mainService: DimeStreamService,
		public uiService: DimeUIService,
		public tagService: DimeTagService,
		public environmentService: DimeEnvironmentService,
		public store: Store<AppState>
		// private router: Router
	) { }

	ngOnInit() {
		this.store.dispatch( DimeEnvironmentActions.ALL.LOAD.initiateifempty() );
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
	/*

		getAll() {
			this.streamService.getAll().subscribe(
				(streamList: any[]) => {
					this.streamList = streamList;
				}, (error) => {
					console.log(error);
					this.toastr.error(error);
				}
			)
		}

		streamDelete(streamID) {
			this.streamService.delete(streamID).subscribe(
				(result) => {
					this.toastr.info("Stream is now deleted. We are now going back to the stream list.");
					this.getAll();
				}, (error) => {
					this.toastr.error(error);
				}
			);
		}*/
}
