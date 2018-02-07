import { Component, OnInit } from '@angular/core';

import { DimeProcessService } from '../dimeprocess.service';
import { DimeEnvironmentService } from '../../dimeenvironment/dimeenvironment.service';

@Component( {
	selector: 'app-dimeprocess-list',
	templateUrl: './dimeprocess-list.component.html',
	styleUrls: ['./dimeprocess-list.component.css']
} )
export class DimeprocessListComponent implements OnInit {

	constructor(
		public mainService: DimeProcessService,
		public environmentService: DimeEnvironmentService
	) { }

	ngOnInit() {
	}
}
