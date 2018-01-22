import { Component, OnInit } from '@angular/core';
import { DimeStreamService } from 'app/dime/dimestream/dimestream.service';

@Component( {
	selector: 'app-dime-stream-detail-fields-hpdb',
	templateUrl: './dime-stream-detail-fields-hpdb.component.html',
	styleUrls: ['./dime-stream-detail-fields-hpdb.component.css']
} )
export class DimeStreamDetailFieldsHpdbComponent implements OnInit {

	constructor( public mainService: DimeStreamService ) { }

	ngOnInit() {
	}

}
