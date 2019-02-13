import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { DimeEnvironmentService } from '../dimeenvironment.service';


@Component( {
	selector: 'app-dimeenvironments',
	templateUrl: './dimeenvironments.component.html',
	styleUrls: ['./dimeenvironments.component.css']
} )
export class DimeenvironmentsComponent implements OnInit {

	constructor(
		private dimeEnvironmentService: DimeEnvironmentService,
		private toastrService: ToastrService
	) { }

	ngOnInit() {
	}

}
