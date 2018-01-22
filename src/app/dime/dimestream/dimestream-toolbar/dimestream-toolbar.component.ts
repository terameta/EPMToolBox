import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DimeStreamService } from '../dimestream.service';
import { DimeTagService } from 'app/dime/dimetag/dimetag.service';
import { DimeUIService } from 'app/ngstore/uistate.service';


@Component( {
	selector: 'app-dimestream-toolbar',
	templateUrl: './dimestream-toolbar.component.html',
	styleUrls: ['./dimestream-toolbar.component.css']
} )
export class DimeStreamToolbarComponent implements OnInit {

	constructor(
		public mainService: DimeStreamService,
		public tagService: DimeTagService,
		public uiService: DimeUIService
	) { }

	ngOnInit() {
	}
}
