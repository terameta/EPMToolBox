import { Component, OnInit } from '@angular/core';

import { AcmUserService } from '../acmuser.service';

@Component( {
	selector: 'app-acmuser-toolbar',
	templateUrl: './acmuser-toolbar.component.html',
	styleUrls: ['./acmuser-toolbar.component.css']
} )
export class AcmUserToolbarComponent implements OnInit {

	constructor( public mainService: AcmUserService ) { }

	ngOnInit() {
	}

}
