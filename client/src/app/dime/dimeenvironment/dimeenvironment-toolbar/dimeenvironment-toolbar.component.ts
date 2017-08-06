import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { ToastrService } from "ngx-toastr";

import { DimeEnvironmentService } from "../dimeenvironment.service";


@Component( {
	selector: "app-dimeenvironment-toolbar",
	templateUrl: "./dimeenvironment-toolbar.component.html",
	styleUrls: ["./dimeenvironment-toolbar.component.css"]
} )
export class DimeenvironmentToolbarComponent implements OnInit {

	constructor( public mainService: DimeEnvironmentService ) { }

	ngOnInit() {
		// this.mainService.getAll();
	}
}
