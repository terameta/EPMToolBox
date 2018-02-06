import { Component, OnInit } from '@angular/core';

import { DimeMapService } from '../../dimemap.service';

@Component( {
	selector: 'app-dimemap-detail-tab-importexport',
	templateUrl: './dimemap-detail-tab-importexport.component.html',
	styleUrls: ['./dimemap-detail-tab-importexport.component.css']
} )
export class DimemapDetailTabImportexportComponent implements OnInit {

	constructor( public mainService: DimeMapService ) { }

	ngOnInit() {
	}

}
