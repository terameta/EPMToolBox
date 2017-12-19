import { Component, OnInit } from '@angular/core';
import { DimeStreamService } from 'app/dime/dimestream/dimestream.service';

@Component( {
	selector: 'app-dime-stream-detail-fields',
	templateUrl: './dime-stream-detail-fields.component.html',
	styleUrls: ['./dime-stream-detail-fields.component.css']
} )
export class DimeStreamDetailFieldsComponent implements OnInit {

	constructor(
		public mainService: DimeStreamService
	) { }

	ngOnInit() {
	}

}
