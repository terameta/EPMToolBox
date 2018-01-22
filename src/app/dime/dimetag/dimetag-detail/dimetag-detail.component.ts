import { Component, OnInit } from '@angular/core';
import { DimeTagService } from 'app/dime/dimetag/dimetag.service';

@Component( {
	selector: 'app-dimetag-detail',
	templateUrl: './dimetag-detail.component.html',
	styleUrls: ['./dimetag-detail.component.css']
} )
export class DimeTagDetailComponent implements OnInit {

	constructor( public mainService: DimeTagService ) { }

	ngOnInit() {
	}

}
