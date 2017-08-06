import { DimeMapService } from '../../../dimemap/dimemap.service';
import { DimeStreamService } from '../../../dimestream/dimestream.service';
import { DimeMatrixService } from '../../dimematrix.service';

import { Component, OnInit } from '@angular/core';

@Component( {
	selector: 'app-dimematrix-detail-fields',
	templateUrl: './dimematrix-detail-fields.component.html',
	styleUrls: ['./dimematrix-detail-fields.component.css']
} )
export class DimematrixDetailFieldsComponent implements OnInit {

	constructor(
		public mainService: DimeMatrixService,
		private mapService: DimeMapService,
		private streamService: DimeStreamService
	) { }

	ngOnInit() {
	}

}
