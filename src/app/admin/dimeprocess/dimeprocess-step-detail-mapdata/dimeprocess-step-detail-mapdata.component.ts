import { Component, OnInit, Input } from '@angular/core';
import { DimeProcessStep } from '../../../../../shared/model/dime/process';
import { DimeMapService } from '../../dimemap/dimemap.service';

@Component( {
	selector: 'app-dimeprocess-step-detail-mapdata',
	templateUrl: './dimeprocess-step-detail-mapdata.component.html',
	styleUrls: ['./dimeprocess-step-detail-mapdata.component.scss']
} )
export class DimeprocessStepDetailMapdataComponent implements OnInit {
	@Input() currentStep: DimeProcessStep;

	constructor( public mapService: DimeMapService ) { }

	ngOnInit() {
	}

}
