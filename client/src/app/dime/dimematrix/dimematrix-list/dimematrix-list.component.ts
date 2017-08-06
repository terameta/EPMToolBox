import { Component, OnInit } from '@angular/core';

import { DimeMatrixService } from '../dimematrix.service';
import { DimeMapService } from '../../dimemap/dimemap.service';

@Component( {
	selector: 'app-dimematrix-list',
	templateUrl: './dimematrix-list.component.html',
	styleUrls: ['./dimematrix-list.component.css']
} )
export class DimeMatrixListComponent implements OnInit {

	constructor(
		public mainService: DimeMatrixService,
		private mapService: DimeMapService
	) { }

	ngOnInit() {
	}

}
