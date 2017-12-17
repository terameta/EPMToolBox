import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Rx';
import { ToastrService } from 'ngx-toastr';

import { DimeEnvironmentService } from '../dimeenvironment.service';

@Component( {
	selector: 'app-dimeenvironment-list',
	templateUrl: './dimeenvironment-list.component.html',
	styleUrls: ['./dimeenvironment-list.component.css']
} )
export class DimeenvironmentListComponent implements OnInit {

	constructor( public mainService: DimeEnvironmentService ) { }

	ngOnInit() {
	}
}
