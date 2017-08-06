import { DimeMapService } from '../../../dimemap/dimemap.service';
import { DimeMatrixService } from '../../dimematrix.service';

import { Component, OnInit } from '@angular/core';

@Component( {
	selector: 'app-dimematrix-detail-maindefinitions',
	templateUrl: './dimematrix-detail-maindefinitions.component.html',
	styleUrls: ['./dimematrix-detail-maindefinitions.component.css']
} )
export class DimematrixDetailMaindefinitionsComponent implements OnInit {

	constructor(
		public mainService: DimeMatrixService,
		public mapService: DimeMapService
	) { }

	ngOnInit() {
	}

}
