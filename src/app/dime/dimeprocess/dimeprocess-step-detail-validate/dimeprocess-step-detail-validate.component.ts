import { Component, OnInit, Input } from '@angular/core';
import { DimeProcessStep } from '../../../../../shared/model/dime/process';
import { DimeMatrixService } from '../../dimematrix/dimematrix.service';
import { DimeProcessService } from '../dimeprocess.service';

@Component( {
	selector: 'app-dimeprocess-step-detail-validate',
	templateUrl: './dimeprocess-step-detail-validate.component.html',
	styleUrls: ['./dimeprocess-step-detail-validate.component.scss']
} )
export class DimeprocessStepDetailValidateComponent implements OnInit {
	@Input() currentStep: DimeProcessStep;

	constructor(
		public mainService: DimeProcessService,
		public matrixService: DimeMatrixService
	) { }

	ngOnInit() {
	}

}
