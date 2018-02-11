import { Component, OnInit, Input } from '@angular/core';
import { DimeProcessStep } from '../../../../../shared/model/dime/process';
import { DimeStreamService } from '../../dimestream/dimestream.service';

@Component( {
	selector: 'app-dimeprocess-step-detail-pushdata',
	templateUrl: './dimeprocess-step-detail-pushdata.component.html',
	styleUrls: ['./dimeprocess-step-detail-pushdata.component.scss']
} )
export class DimeprocessStepDetailPushdataComponent implements OnInit {
	@Input() currentStep: DimeProcessStep;
	constructor( public streamService: DimeStreamService ) { }

	ngOnInit() {
	}

}
