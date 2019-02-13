import { Component, OnInit } from '@angular/core';

import { DimeProcessService } from '../../dimeprocess.service';
import { ToastrService } from 'ngx-toastr';
import { DimeProcessStepType } from '../../../../../../shared/model/dime/process';
import { DimeStreamService } from '../../../dimestream/dimestream.service';

@Component( {
	selector: 'app-dimeprocess-detail-tab-filters',
	templateUrl: './dimeprocess-detail-tab-filters.component.html',
	styleUrls: ['./dimeprocess-detail-tab-filters.component.css']
} )
export class DimeprocessDetailTabFiltersComponent implements OnInit {
	public sourceStreamID = 0;
	private numberofIdentifyStreamTrials = 0;
	private numberofPrepareFiltersTrials = 0;

	constructor(
		public mainService: DimeProcessService,
		public streamService: DimeStreamService,
		private toastr: ToastrService
	) { }

	ngOnInit() {
		this.identifyStream();
		this.prepareFilters();
	}

	private identifyStream = () => {
		if ( this.mainService.currentItem ) {
			if ( this.mainService.currentItem.steps ) {
				this.sourceStreamID = this.mainService.currentItem.steps.filter( step => step.type === DimeProcessStepType.PullData ).map( step => step.referedid )[0];
			}
		}

		if ( !this.sourceStreamID ) {
			if ( this.numberofIdentifyStreamTrials++ < 200 ) {
				setTimeout( this.identifyStream, 500 );
			} else {
				this.toastr.error( 'Failed to identify target stream. Process is not ready yet.' );
			}
		}
	}
	private prepareFilters = () => {
		let shouldTry = true;
		if ( !this.sourceStreamID ) {
			shouldTry = false;
		}
		if ( this.sourceStreamID && !this.streamService.itemObject[this.sourceStreamID] ) {
			shouldTry = false;
		}

		if ( this.sourceStreamID && this.streamService.itemObject[this.sourceStreamID] && !this.streamService.itemObject[this.sourceStreamID].fieldList ) {
			shouldTry = false;
		}

		if ( shouldTry ) {
			this.streamService.itemObject[this.sourceStreamID].fieldList.filter( field => field.isFilter ).forEach( field => {
				if ( this.mainService.currentItem.filters[field.id] ) {
					this.mainService.currentItem.filters[field.id] = Object.assign( this.mainService.currentItem.filters[field.id], { field: field.id } );
				} else {
					this.mainService.currentItem.filters[field.id] = Object.assign( {}, { field: field.id } );
				}
			} );
		} else {
			if ( this.numberofPrepareFiltersTrials++ < 200 ) {
				setTimeout( this.prepareFilters, 500 );
			} else {
				this.toastr.error( 'Failed to prepare filters.' );
			}
		}
	}

	public applyFilters = () => this.mainService.filtersUpdate();
}
