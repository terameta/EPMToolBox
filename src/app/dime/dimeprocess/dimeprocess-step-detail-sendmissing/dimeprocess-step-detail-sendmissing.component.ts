import { Component, OnInit, Input } from '@angular/core';
import { DimeProcessStep } from '../../../../../shared/model/dime/process';

@Component( {
	selector: 'app-dimeprocess-step-detail-sendmissing',
	templateUrl: './dimeprocess-step-detail-sendmissing.component.html',
	styleUrls: ['./dimeprocess-step-detail-sendmissing.component.scss']
} )
export class DimeprocessStepDetailSendmissingComponent implements OnInit {
	@Input() currentStep: DimeProcessStep;

	constructor() { }

	ngOnInit() {
	}

}
