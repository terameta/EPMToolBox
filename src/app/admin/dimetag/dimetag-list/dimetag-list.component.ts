import { Component, OnInit } from '@angular/core';
import { DimeTagService } from '../dimetag.service';

@Component( {
	selector: 'app-dimetag-list',
	templateUrl: './dimetag-list.component.html',
	styleUrls: ['./dimetag-list.component.css']
} )
export class DimeTagListComponent implements OnInit {

	constructor( public mainService: DimeTagService ) { }

	ngOnInit() {
	}

}
