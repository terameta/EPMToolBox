import { Component, OnInit, Input } from '@angular/core';
import { DimeProcessStep } from '../../../../../shared/model/dime/process';

@Component( {
	selector: 'app-dimeprocess-step-detail-srcprocedure',
	templateUrl: './dimeprocess-step-detail-srcprocedure.component.html',
	styleUrls: ['./dimeprocess-step-detail-srcprocedure.component.scss']
} )
export class DimeprocessStepDetailSrcprocedureComponent implements OnInit {
	@Input() currentStep: DimeProcessStep;

	constructor() { }

	ngOnInit() {
	}

}
