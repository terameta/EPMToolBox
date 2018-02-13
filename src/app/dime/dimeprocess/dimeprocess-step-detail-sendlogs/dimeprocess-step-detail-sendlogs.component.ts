import { Component, OnInit, Input } from '@angular/core';
import { DimeProcessStep } from '../../../../../shared/model/dime/process';

@Component( {
	selector: 'app-dimeprocess-step-detail-sendlogs',
	templateUrl: './dimeprocess-step-detail-sendlogs.component.html',
	styleUrls: ['./dimeprocess-step-detail-sendlogs.component.scss']
} )
export class DimeprocessStepDetailSendlogsComponent implements OnInit {
	@Input() currentStep: DimeProcessStep;

	constructor() { }

	ngOnInit() {
	}
	public recepientAdd = () => {
		if ( !Array.isArray( this.currentStep.detailsObject ) ) {
			console.log( 'DetailsObject is not an array' );
			this.currentStep.detailsObject = [];
		}
		this.currentStep.detailsObject.push( { address: '' } );
	}
	public recepientDelete = ( index: number ) => {
		console.log( index, this.currentStep.detailsObject[index] );
		if ( index !== undefined ) {
			console.log( this.currentStep.detailsObject.splice( index, 1 ) );
		}
	}
}
