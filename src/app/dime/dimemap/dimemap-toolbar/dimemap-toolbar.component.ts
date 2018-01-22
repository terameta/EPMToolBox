import { Observable } from 'rxjs/Rx';
import { Component, OnInit } from '@angular/core';

import { DimeMapService } from '../dimemap.service';
import { DimeTagService } from 'app/dime/dimetag/dimetag.service';
import { DimeUIService } from 'app/ngstore/uistate.service';

@Component( {
	selector: 'app-dimemap-toolbar',
	templateUrl: './dimemap-toolbar.component.html',
	styleUrls: ['./dimemap-toolbar.component.css']
} )
export class DimemapToolbarComponent implements OnInit {

	constructor(
		public mainService: DimeMapService,
		public tagService: DimeTagService,
		public uiService: DimeUIService
	) { }

	ngOnInit() { }
}
