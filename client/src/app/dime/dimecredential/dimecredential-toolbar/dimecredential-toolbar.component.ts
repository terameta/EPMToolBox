import { Component, OnInit } from '@angular/core';

import { DimeCredentialService } from 'app/dime/dimecredential/dimecredential.service';

@Component( {
	selector: 'app-dimecredential-toolbar',
	templateUrl: './dimecredential-toolbar.component.html',
	styleUrls: ['./dimecredential-toolbar.component.css']
} )
export class DimeCredentialToolbarComponent implements OnInit {

	constructor( public mainService: DimeCredentialService ) { }

	ngOnInit() {
	}

}
