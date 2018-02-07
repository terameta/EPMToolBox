import { Component, OnInit } from '@angular/core';
import { DimeMatrixService } from '../../dimematrix.service';

@Component( {
	selector: 'app-dimematrix-detail-import',
	templateUrl: './dimematrix-detail-import.component.html',
	styleUrls: ['./dimematrix-detail-import.component.scss']
} )
export class DimematrixDetailImportComponent implements OnInit {

	constructor( public mainService: DimeMatrixService ) { }

	ngOnInit() {
	}

}
