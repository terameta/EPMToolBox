import { DimeScheduleStepType } from '../../../../../../shared/enums/dime/schedulesteptypes';
import { EnumToArray, SortByPosition } from '../../../../../../shared/utilities/utilityFunctions';
import { Component, OnInit } from '@angular/core';
import { DimeScheduleService } from '../../dimeschedule.service';
import { DimeProcessService } from '../../../dimeprocess/dimeprocess.service';


@Component( {
	selector: 'app-dimeschedule-detail-steps',
	templateUrl: './dimeschedule-detail-steps.component.html',
	styleUrls: ['./dimeschedule-detail-steps.component.css']
} )
export class DimescheduleDetailStepsComponent implements OnInit {
	public stepTypeArray = EnumToArray( DimeScheduleStepType );
	private stepType = DimeScheduleStepType;

	constructor(
		public mainService: DimeScheduleService,
		public processService: DimeProcessService
	) { }

	ngOnInit() {
	}
	public stepAdd = () => {
		let curMax = 0;
		this.mainService.currentItem.steps.forEach( ( curStep ) => {
			if ( curStep.position >= curMax ) {
				curMax = curStep.position;
			}
		} );
		this.mainService.currentItem.steps.push( { type: 0, referedid: 0, position: ++curMax } );
	}
	private stepDelete = ( index: number ) => {
		this.mainService.currentItem.steps.splice( index, 1 );
		this.mainService.currentItem.steps.forEach( ( curStep, stepIndex ) => {
			curStep.position = stepIndex;
		} );
	}
	public stepMoveOrder = ( curStep: any, direction: string ) => {
		const curPosition = curStep.position;
		const nextPosition = parseInt( curPosition, 10 ) + ( direction === 'down' ? 1 : -1 );
		this.mainService.currentItem.steps.forEach( ( curItem ) => {
			if ( curItem.position === nextPosition ) { curItem.position = curPosition; }
		} );
		curStep.position = nextPosition;
		this.mainService.currentItem.steps.sort( SortByPosition );
	}
	public findStepType = ( type: number ) => {
		return DimeScheduleStepType[type];
	}
}
