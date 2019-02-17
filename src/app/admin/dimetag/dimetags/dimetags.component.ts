import { Component, OnInit } from '@angular/core';
import { DimeTagService } from '../dimetag.service';

@Component( {
	selector: 'app-dimetags',
	templateUrl: './dimetags.component.html',
	styleUrls: ['./dimetags.component.css']
} )
export class DimeTagsComponent implements OnInit {

	constructor( public mainService: DimeTagService ) { }

	ngOnInit() {
	}

}
