import { DimeProcessService } from '../../dimeprocess.service';
import { Component, OnInit } from '@angular/core';
import { DimeStreamService } from '../../../dimestream/dimestream.service';
import { ToastrService } from 'ngx-toastr';
import { DimeProcessStepType } from '../../../../../../shared/model/dime/process';

@Component( {
	selector: 'app-dimeprocess-detail-tab-filtersdatafile',
	templateUrl: './dimeprocess-detail-tab-filtersdatafile.component.html',
	styleUrls: ['./dimeprocess-detail-tab-filtersdatafile.component.css']
} )
export class DimeprocessDetailTabFiltersdatafileComponent implements OnInit {
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
			this.streamService.itemObject[this.sourceStreamID].fieldList.filter( field => field.isCrossTabFilter ).forEach( field => {
				if ( this.mainService.currentItem.filtersDataFile[field.id] ) {
					this.mainService.currentItem.filtersDataFile[field.id] = Object.assign( this.mainService.currentItem.filtersDataFile[field.id], { field: field.id } );
				} else {
					this.mainService.currentItem.filtersDataFile[field.id] = Object.assign( {}, { field: field.id } );
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

	public applyFiltersDataFile = () => this.mainService.filtersDataFileUpdate();

}
