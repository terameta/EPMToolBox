import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';

import { DimeMapService } from '../dimemap.service';
import { DimeTagService } from '../../dimetag/dimetag.service';
import { DimeUIService } from '../../../ngstore/uistate.service';

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
