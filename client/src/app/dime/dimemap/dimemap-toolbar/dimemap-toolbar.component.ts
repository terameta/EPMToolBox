import { Observable } from 'rxjs/Rx';
import { Component, OnInit } from '@angular/core';

import { DimeMapService } from '../dimemap.service';

@Component( {
	selector: 'app-dimemap-toolbar',
	templateUrl: './dimemap-toolbar.component.html',
	styleUrls: ['./dimemap-toolbar.component.css']
} )
export class DimemapToolbarComponent implements OnInit {

	constructor( public mainService: DimeMapService ) { }

	ngOnInit() {
		// this.mainService.getAll();
	}
}
