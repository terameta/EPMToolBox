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

	// public applyFilters = () => {
	// 	// let toSend: any; toSend = {};
	// 	// toSend.process = this.curItem.id;
	// 	// toSend.stream = this.curItemSourceStream.id;
	// 	// toSend.filters = [];
	// 	// Object.keys( this.curItemFilters ).forEach( ( curKey ) => {
	// 	// 	let toPush: any; toPush = {};
	// 	// 	this.curItemSourceFields.forEach( ( curField ) => {

	// 	// 		if ( curField.name === curKey ) {
	// 	// 			toPush.field = curField.id;
	// 	// 		} else {
	// 	// 		}
	// 	// 	} );
	// 	// 	toPush.filterfrom = this.curItemFilters[curKey].filterfrom;
	// 	// 	toPush.filterto = this.curItemFilters[curKey].filterto;
	// 	// 	toPush.filtertext = this.curItemFilters[curKey].filtertext;
	// 	// 	toPush.filterbeq = this.curItemFilters[curKey].filterbeq;
	// 	// 	toPush.filterseq = this.curItemFilters[curKey].filterseq;
	// 	// 	toSend.filters.push( toPush );
	// 	// } );
	// 	// this.authHttp.put( this.baseUrl + '/filters/' + this.curItem.id, toSend, { headers: this.headers } ).
	// 	// 	map( response => response.json() ).
	// 	// 	subscribe( ( result ) => {
	// 	// 		this.toastr.info( 'Successfully applied filters.', this.serviceName );
	// 	// 	}, ( error ) => {
	// 	// 		this.toastr.error( 'Failed to apply filters.', this.serviceName );
	// 	// 		console.error( error );
	// 	// 	} );
	// }

	public fetchFilters = ( id?: number ) => {
		// if ( !id ) { id = this.curItem.id; }
		// this.fetchFiltersFetch( id ).
		// 	subscribe( ( result ) => {
		// 		this.prepareFilters( result );
		// 	}, ( error ) => {
		// 		this.toastr.error( '', this.serviceName );
		// 		console.error( error );
		// 	} );
	}
	public fetchFiltersFetch = ( id: number ) => {
		// return this.authHttp.get( this.baseUrl + '/filters/' + id ).
		// 	map( response => response.json() ).
		// 	catch( error => Observable.throw( error ) );
	}
}
