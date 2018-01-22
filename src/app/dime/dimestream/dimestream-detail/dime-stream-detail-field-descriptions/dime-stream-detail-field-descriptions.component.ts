import { Component, OnInit } from '@angular/core';
import { DimeStreamService } from 'app/dime/dimestream/dimestream.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component( {
	selector: 'app-dime-stream-detail-field-descriptions',
	templateUrl: './dime-stream-detail-field-descriptions.component.html',
	styleUrls: ['./dime-stream-detail-field-descriptions.component.css']
} )
export class DimeStreamDetailFieldDescriptionsComponent implements OnInit {

	constructor( public mainService: DimeStreamService ) {
	}

	ngOnInit() {
	}
}
