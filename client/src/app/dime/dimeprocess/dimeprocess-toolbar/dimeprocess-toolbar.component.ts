import { Component, OnInit } from '@angular/core';

import { DimeProcessService } from '../dimeprocess.service';

@Component( {
	selector: 'app-dimeprocess-toolbar',
	templateUrl: './dimeprocess-toolbar.component.html',
	styleUrls: ['./dimeprocess-toolbar.component.css']
} )
export class DimeprocessToolbarComponent implements OnInit {

	constructor( private mainService: DimeProcessService ) { }

	ngOnInit() {
		this.mainService.getAll();
	}

}
