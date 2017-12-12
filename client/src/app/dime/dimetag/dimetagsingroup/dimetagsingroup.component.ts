import { Component, OnInit } from '@angular/core';
import { DimeTagService } from 'app/dime/dimetag/dimetag.service';

@Component( {
	selector: 'app-dimetagsingroup',
	templateUrl: './dimetagsingroup.component.html',
	styleUrls: ['./dimetagsingroup.component.css']
} )
export class DimeTagsinGroupComponent implements OnInit {

	constructor( public mainService: DimeTagService ) { }

	ngOnInit() {
	}

}
