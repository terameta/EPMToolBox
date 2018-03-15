import { Component, OnInit } from '@angular/core';
import { DimeStreamService } from '../../dimestream.service';
import { DimeStreamType } from '../../../../../../shared/enums/dime/streamtypes';

@Component( {
	selector: 'app-dime-stream-detail-export',
	templateUrl: './dime-stream-detail-export.component.html',
	styleUrls: ['./dime-stream-detail-export.component.scss']
} )
export class DimeStreamDetailExportComponent implements OnInit {
	public streamTypes = DimeStreamType;

	constructor(
		public mainService: DimeStreamService
	) { }

	ngOnInit() {
	}

}
