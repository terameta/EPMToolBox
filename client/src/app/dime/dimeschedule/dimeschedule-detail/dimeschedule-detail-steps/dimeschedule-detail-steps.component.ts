import { DimeScheduleStepType } from '../../../../../../../shared/enums/dime/schedulesteptypes';
import { EnumToArray, SortByPosition } from '../../../../../../../shared/utilities/utilityFunctions';
import { Component, OnInit } from '@angular/core';
import { DimeScheduleService } from 'app/dime/dimeschedule/dimeschedule.service';
import { DimeProcessService } from '../../../dimeprocess/dimeprocess.service';


@Component( {
	selector: 'app-dimeschedule-detail-steps',
	templateUrl: './dimeschedule-detail-steps.component.html',
	styleUrls: ['./dimeschedule-detail-steps.component.css']
} )
export class DimescheduleDetailStepsComponent implements OnInit {
	private stepTypeArray = EnumToArray( DimeScheduleStepType );
	private stepType = DimeScheduleStepType;

	constructor(
		private mainService: DimeScheduleService,
		private processService: DimeProcessService
	) { }

	ngOnInit() {
		this.processService.getAll();
	}

	private stepAdd = () => {
		let curMax = 0;
		this.mainService.curItem.steps.forEach(( curStep ) => {
			if ( curStep.position >= curMax ) {
				curMax = curStep.position;
			}
		} );
		this.mainService.curItem.steps.push( { type: 0, referedid: 0, position: ++curMax } );
	};
	private stepDelete = ( index: number ) => {
		this.mainService.curItem.steps.splice( index, 1 );
		this.mainService.curItem.steps.forEach(( curStep, stepIndex ) => {
			curStep.position = stepIndex;
		} );
	};
	public stepMoveOrder = ( curStep: any, direction: string ) => {
		const curPosition = curStep.position;
		const nextPosition = parseInt( curPosition, 10 ) + ( direction === 'down' ? 1 : -1 );
		this.mainService.curItem.steps.forEach(( curItem ) => {
			if ( curItem.position === nextPosition ) { curItem.position = curPosition; }
		} );
		curStep.position = nextPosition;
		this.mainService.curItem.steps.sort( SortByPosition );
	};
	public findStepType = ( type: number ) => {
		return DimeScheduleStepType[type];
	}

}
