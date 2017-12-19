import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DimeEnvironmentService } from '../dimeenvironment.service';
import { DimeTagService } from 'app/dime/dimetag/dimetag.service';
import { DimeUIService } from 'app/ngstore/uistate.service';


@Component( {
	selector: 'app-dimeenvironment-toolbar',
	templateUrl: './dimeenvironment-toolbar.component.html',
	styleUrls: ['./dimeenvironment-toolbar.component.css']
} )
export class DimeenvironmentToolbarComponent implements OnInit {

	constructor(
		public mainService: DimeEnvironmentService,
		public tagService: DimeTagService,
		public uiService: DimeUIService
	) { }

	ngOnInit() {
	}
}
