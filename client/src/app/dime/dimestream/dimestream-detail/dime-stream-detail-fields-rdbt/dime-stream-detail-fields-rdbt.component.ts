import { Component, OnInit } from '@angular/core';
import { DimeStreamService } from 'app/dime/dimestream/dimestream.service';

@Component( {
	selector: 'app-dime-stream-detail-fields-rdbt',
	templateUrl: './dime-stream-detail-fields-rdbt.component.html',
	styleUrls: ['./dime-stream-detail-fields-rdbt.component.css']
} )
export class DimeStreamDetailFieldsRdbtComponent implements OnInit {

	constructor( public mainService: DimeStreamService ) { }

	ngOnInit() {
	}

}
