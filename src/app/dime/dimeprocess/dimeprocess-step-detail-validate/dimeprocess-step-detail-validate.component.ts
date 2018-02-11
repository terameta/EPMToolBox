import { Component, OnInit, Input } from '@angular/core';
import { DimeProcessStep } from '../../../../../shared/model/dime/process';

@Component( {
	selector: 'app-dimeprocess-step-detail-validate',
	templateUrl: './dimeprocess-step-detail-validate.component.html',
	styleUrls: ['./dimeprocess-step-detail-validate.component.scss']
} )
export class DimeprocessStepDetailValidateComponent implements OnInit {
	@Input() currentStep: DimeProcessStep;

	constructor() { }

	ngOnInit() {
	}

}
