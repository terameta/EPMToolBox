import { Component, OnInit } from '@angular/core';

import { AcmServerService } from '../acmserver.service';

@Component( {
	selector: 'app-acmserver-list',
	templateUrl: './acmserver-list.component.html',
	styleUrls: ['./acmserver-list.component.css']
} )
export class AcmServerListComponent implements OnInit {

	constructor( public mainService: AcmServerService ) { }

	ngOnInit() {
	}

}
