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

}
