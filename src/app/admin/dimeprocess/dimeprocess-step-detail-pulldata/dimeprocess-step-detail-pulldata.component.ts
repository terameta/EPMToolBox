import { Component, OnInit, Input } from '@angular/core';
import { DimeProcessStep } from '../../../../../shared/model/dime/process';
import { DimeStreamService } from '../../dimestream/dimestream.service';

@Component( {
	selector: 'app-dimeprocess-step-detail-pulldata',
	templateUrl: './dimeprocess-step-detail-pulldata.component.html',
	styleUrls: ['./dimeprocess-step-detail-pulldata.component.scss']
} )
export class DimeprocessStepDetailPulldataComponent implements OnInit {
	@Input() currentStep: DimeProcessStep;

	constructor( public streamService: DimeStreamService ) { }

	ngOnInit() {
	}

}
