import { Component, OnInit } from '@angular/core';
import { DimeCredentialService } from '../dimecredential.service';
import { DimeTagService } from '../../dimetag/dimetag.service';
import { DimeUIService } from '../../../ngstore/uistate.service';


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
