import { Component, OnInit } from '@angular/core';

import { DimeMatrixService } from '../dimematrix.service';
import { DimeStreamService } from '../../dimestream/dimestream.service';

@Component({
	selector: 'app-dimematrix-list',
	templateUrl: './dimematrix-list.component.html',
	styleUrls: ['./dimematrix-list.component.css']
})
export class DimeMatrixListComponent implements OnInit {

	constructor(
		private mainService: DimeMatrixService,
		private streamService: DimeStreamService
	) { }

	ngOnInit() {
	}

}
