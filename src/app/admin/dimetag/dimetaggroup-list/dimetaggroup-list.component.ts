import { Component, OnInit } from '@angular/core';
import { DimeTagService } from '../dimetag.service';

@Component( {
	selector: 'app-dimetaggroup-list',
	templateUrl: './dimetaggroup-list.component.html',
	styleUrls: ['./dimetaggroup-list.component.css']
} )
export class DimeTagGroupListComponent implements OnInit {

	constructor( public mainService: DimeTagService ) { }

	ngOnInit() {
	}

}
