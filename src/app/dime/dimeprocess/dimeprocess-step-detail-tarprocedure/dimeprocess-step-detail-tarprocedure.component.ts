import { Component, OnInit, Input } from '@angular/core';
import { DimeProcessStep } from '../../../../../shared/model/dime/process';

@Component( {
	selector: 'app-dimeprocess-step-detail-tarprocedure',
	templateUrl: './dimeprocess-step-detail-tarprocedure.component.html',
	styleUrls: ['./dimeprocess-step-detail-tarprocedure.component.scss']
} )
export class DimeprocessStepDetailTarprocedureComponent implements OnInit {
	@Input() currentStep: DimeProcessStep;

	constructor() { }

	ngOnInit() {
	}

}
