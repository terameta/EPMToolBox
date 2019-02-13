import { Component, OnInit } from '@angular/core';
import { DimeMatrixService } from '../../dimematrix.service';

@Component( {
	selector: 'app-dimematrix-detail-export',
	templateUrl: './dimematrix-detail-export.component.html',
	styleUrls: ['./dimematrix-detail-export.component.scss']
} )
export class DimematrixDetailExportComponent implements OnInit {

	constructor( public mainService: DimeMatrixService ) { }

	ngOnInit() {
	}

}
