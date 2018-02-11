import { Component, OnInit } from '@angular/core';
import { DimeProcessService } from '../dimeprocess.service';
import { DimeProcessStepType, getDimeProcessStepTypeNames } from '../../../../../shared/model/dime/process';
import { DimeEnvironmentService } from '../../dimeenvironment/dimeenvironment.service';
import { DimeStreamService } from '../../dimestream/dimestream.service';
import * as _ from 'lodash';
import { DimeMapService } from '../../dimemap/dimemap.service';
import { DimeMatrixService } from '../../dimematrix/dimematrix.service';
import { SortByPosition } from '../../../../../shared/utilities/utilityFunctions';

@Component( {
	selector: 'app-dimeprocess-step-list',
	templateUrl: './dimeprocess-step-list.component.html',
	styleUrls: ['./dimeprocess-step-list.component.scss']
} )
export class DimeprocessStepListComponent implements OnInit {
	public processStepTypeName = getDimeProcessStepTypeNames();

	public dimeProcessStepType = DimeProcessStepType;
	// public stepTypes = _.map( DimeProcessStepType, ( value, prop ) => ( { type: prop, value } ) );
	public stepTypes = _.toArray( DimeProcessStepType );

	constructor(
		public mainService: DimeProcessService,
		public environmentService: DimeEnvironmentService,
		public streamService: DimeStreamService,
		public mapService: DimeMapService,
		public matrixService: DimeMatrixService
	) { }

	ngOnInit() {
	}

	public stepMove = ( step, direction ) => {
		const curOrder = step.position;
		const nextOrder = parseInt( curOrder, 10 ) + ( direction === 'down' ? 1 : -1 );
		this.mainService.currentItem.steps.forEach( ( currentStep ) => {
			if ( currentStep.position === nextOrder ) { currentStep.position = curOrder; }
		} );
		step.position = nextOrder;
		this.mainService.currentItem.steps.sort( SortByPosition );
	}

}
