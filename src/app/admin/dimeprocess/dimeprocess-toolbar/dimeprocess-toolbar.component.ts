import { Component, OnInit } from '@angular/core';

import { DimeProcessService } from '../dimeprocess.service';
import { DimeTagService } from '../../dimetag/dimetag.service';
import { DimeUIService } from '../../../ngstore/uistate.service';

@Component( {
	selector: 'app-dimeprocess-toolbar',
	templateUrl: './dimeprocess-toolbar.component.html',
	styleUrls: ['./dimeprocess-toolbar.component.css']
} )
export class DimeprocessToolbarComponent implements OnInit {

	constructor(
		public mainService: DimeProcessService,
		public tagService: DimeTagService,
		public uiService: DimeUIService
	) { }

	ngOnInit() { }

}
