import { Component, OnInit } from '@angular/core';
import { DimeStreamService } from '../../dimestream.service';

@Component( {
	selector: 'app-dime-stream-detail-field-descriptions',
	templateUrl: './dime-stream-detail-field-descriptions.component.html',
	styleUrls: ['./dime-stream-detail-field-descriptions.component.css']
} )
export class DimeStreamDetailFieldDescriptionsComponent implements OnInit {

	constructor( public mainService: DimeStreamService ) { }

	ngOnInit() { }
}
