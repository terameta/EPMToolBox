import { Component, OnInit } from '@angular/core';

import { DimeCredentialService } from 'app/dime/dimecredential/dimecredential.service';
import { DimeTagService } from 'app/dime/dimetag/dimetag.service';
import { DimeUIService } from 'app/ngstore/uistate.service';

@Component( {
	selector: 'app-dimecredential-toolbar',
	templateUrl: './dimecredential-toolbar.component.html',
	styleUrls: ['./dimecredential-toolbar.component.css']
} )
export class DimeCredentialToolbarComponent implements OnInit {

	constructor( public mainService: DimeCredentialService, public tagService: DimeTagService, public uiService: DimeUIService ) { }

	ngOnInit() {
	}

}
