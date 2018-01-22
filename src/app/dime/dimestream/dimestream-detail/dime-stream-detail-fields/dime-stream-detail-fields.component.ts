import { Component, OnInit } from '@angular/core';
import { DimeStreamService } from '../../dimestream.service';
import { DimeStreamType } from '../../../../../../shared/enums/dime/streamtypes';

@Component( {
	selector: 'app-dime-stream-detail-fields',
	templateUrl: './dime-stream-detail-fields.component.html',
	styleUrls: ['./dime-stream-detail-fields.component.css']
} )
export class DimeStreamDetailFieldsComponent implements OnInit {
	constructor( public mainService: DimeStreamService ) { }

	ngOnInit() {
	}
}
