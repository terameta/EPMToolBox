import { Component, OnInit } from '@angular/core';
import { DimeTagService } from '../dimetag.service';

@Component( {
	selector: 'app-dimetag-toolbar',
	templateUrl: './dimetag-toolbar.component.html',
	styleUrls: ['./dimetag-toolbar.component.css']
} )
export class DimeTagToolbarComponent implements OnInit {

	constructor( public mainService: DimeTagService ) { }

	ngOnInit() {
	}

}
