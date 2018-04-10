import { Component, OnInit, OnDestroy } from '@angular/core';
import { DimeStreamService } from '../../dimestream.service';
import { DimeStreamType } from '../../../../../../shared/enums/dime/streamtypes';

@Component( {
	selector: 'app-dime-stream-detail-export-detail',
	templateUrl: './dime-stream-detail-export-detail.component.html',
	styleUrls: ['./dime-stream-detail-export-detail.component.scss']
} )
export class DimeStreamDetailExportDetailComponent implements OnInit, OnDestroy {
	public streamTypes = DimeStreamType;
	public export: any = {};


	constructor(
		public mainService: DimeStreamService
	) { }

	ngOnInit() { }

	ngOnDestroy() { }

}
