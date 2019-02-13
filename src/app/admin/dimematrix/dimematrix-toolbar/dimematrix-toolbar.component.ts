import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';

import { DimeMatrixService } from '../dimematrix.service';
import { DimeTagService } from '../../dimetag/dimetag.service';
import { DimeUIService } from '../../../ngstore/uistate.service';

@Component( {
	selector: 'app-dimematrix-toolbar',
	templateUrl: './dimematrix-toolbar.component.html',
	styleUrls: ['./dimematrix-toolbar.component.css']
} )
export class DimeMatrixToolbarComponent implements OnInit {

	constructor(
		public mainService: DimeMatrixService,
		public tagService: DimeTagService,
		public uiService: DimeUIService
	) { }

	ngOnInit() {
	}
}
