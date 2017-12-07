import { Component, OnInit } from '@angular/core';
import { DimeCredentialService } from 'app/dime/dimecredential/dimecredential.service';

@Component( {
	selector: 'app-dimecredential-list',
	templateUrl: './dimecredential-list.component.html',
	styleUrls: ['./dimecredential-list.component.css']
} )
export class DimeCredentialListComponent implements OnInit {

	constructor( public mainService: DimeCredentialService ) { }

	ngOnInit() {
	}

}
