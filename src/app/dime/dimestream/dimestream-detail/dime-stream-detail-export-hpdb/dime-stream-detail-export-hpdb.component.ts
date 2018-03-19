import { Component, OnInit } from '@angular/core';
import { DimeStreamService } from '../../dimestream.service';

@Component( {
	selector: 'app-dime-stream-detail-export-hpdb',
	templateUrl: './dime-stream-detail-export-hpdb.component.html',
	styleUrls: ['./dime-stream-detail-export-hpdb.component.scss']
} )
export class DimeStreamDetailExportHPDBComponent implements OnInit {
	public rowDims: any[] = [];
	public colDims: any[] = [];

	constructor(
		public mainService: DimeStreamService
	) { }

	ngOnInit() {
	}

}
