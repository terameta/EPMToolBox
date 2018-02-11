import { Component, OnInit, Input } from '@angular/core';
import { DimeProcessStep } from '../../../../../shared/model/dime/process';

@Component( {
	selector: 'app-dimeprocess-step-detail-senddata',
	templateUrl: './dimeprocess-step-detail-senddata.component.html',
	styleUrls: ['./dimeprocess-step-detail-senddata.component.scss']
} )
export class DimeprocessStepDetailSenddataComponent implements OnInit {
	@Input() currentStep: DimeProcessStep;

	constructor() { }

	ngOnInit() {
	}

}
