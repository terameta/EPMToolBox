import { Component, OnInit } from '@angular/core';
import { DimeProcessService } from '../dimeprocess.service';
import { dimeProcessStepTypeName, DimeProcessStepType, getDimeProcessStepTypeNames } from '../../../../../shared/model/dime/process';
import { DimeEnvironmentService } from '../../dimeenvironment/dimeenvironment.service';
import { DimeStreamService } from '../../dimestream/dimestream.service';

@Component( {
	selector: 'app-dimeprocess-step-list',
	templateUrl: './dimeprocess-step-list.component.html',
	styleUrls: ['./dimeprocess-step-list.component.scss']
} )
export class DimeprocessStepListComponent implements OnInit {
	public processStepTypeName = getDimeProcessStepTypeNames();

	private dimeProcessStepType = DimeProcessStepType;

	constructor(
		public mainService: DimeProcessService,
		public environmentService: DimeEnvironmentService,
		public streamService: DimeStreamService
	) { }

	ngOnInit() {
	}

}
