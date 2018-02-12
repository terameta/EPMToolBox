import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { DimeProcessStep, DimeProcessStepType } from '../../../../../shared/model/dime/process';
import { SortByPosition } from '../../../../../shared/utilities/utilityFunctions';
import { DimeProcessService } from '../dimeprocess.service';
import { DimeStreamService } from '../../dimestream/dimestream.service';
import { DimeStreamFieldDetail } from '../../../../../shared/model/dime/streamfield';

@Component( {
	selector: 'app-dimeprocess-step-detail-transform',
	templateUrl: './dimeprocess-step-detail-transform.component.html',
	styleUrls: ['./dimeprocess-step-detail-transform.component.scss']
} )
export class DimeprocessStepDetailTransformComponent implements OnInit, OnDestroy {
	@Input() currentStep: DimeProcessStep;

	public sourceFields: DimeStreamFieldDetail[] = [];
	public targetFields: DimeStreamFieldDetail[] = [];
	private toDelay = 0;
	private currentTimeout;

	constructor(
		public mainService: DimeProcessService,
		public streamService: DimeStreamService
	) { }

	ngOnInit() {
		this.stepPrepareFields();
	}

	ngOnDestroy() {
		clearTimeout( this.currentTimeout );
	}

	public stepTransformationAdd = () => {
		if ( !this.currentStep.detailsObject ) { this.currentStep.detailsObject = []; }
		this.currentStep.detailsObject.push( { position: this.currentStep.detailsObject.length } );
		this.currentStep.detailsObject.sort( SortByPosition );
	}
	// public stepTransformationMove = ( curManipulation: any, direction: string ) => {
	// 	const curOrder = curManipulation.position;
	// 	const nextOrder = parseInt( curOrder, 10 ) + ( direction === 'down' ? 1 : -1 );
	// 	this.curStepTransformations.forEach( function ( curField ) {
	// 		if ( curField.position === nextOrder ) {
	// 			curField.position = curOrder;
	// 		}
	// 	} );
	// 	curManipulation.position = nextOrder;
	// 	this.stepTransformationSort();
	// };
	// public stepTransformationDelete = ( curManipulation: any, index: number ) => {
	// 	if ( index !== undefined ) {
	// 		this.curStepTransformations.splice( index, 1 );
	// 	}
	// 	this.stepTransformationSort();
	// };

	private stepPrepareFields = () => {
		this.toDelay += 500;
		const sourceStream = this.mainService.currentItem.steps.filter( step => step.type === DimeProcessStepType.PullData ).map( step => step.referedid )[0];
		const targetStream = this.mainService.currentItem.steps.filter( step => step.type === DimeProcessStepType.PushData ).map( step => step.referedid )[0];
		if ( !sourceStream || !targetStream ) {
			this.currentTimeout = setTimeout( this.stepPrepareFields, this.toDelay );
		} else {
			if ( !this.streamService.itemObject[sourceStream] || !this.streamService.itemObject[targetStream] ) {
				this.currentTimeout = setTimeout( this.stepPrepareFields, this.toDelay );
			} else if ( !this.streamService.itemObject[sourceStream].fieldList || !this.streamService.itemObject[targetStream].fieldList ) {
				this.currentTimeout = setTimeout( this.stepPrepareFields, this.toDelay );
			} else {
				this.sourceFields = this.streamService.itemObject[sourceStream].fieldList.map( field => ( <DimeStreamFieldDetail>{ id: field.id, name: field.name } ) );
				this.targetFields = this.streamService.itemObject[targetStream].fieldList.map( field => ( <DimeStreamFieldDetail>{ id: field.id, name: field.name } ) );
			}
		}
	}
}
