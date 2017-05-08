import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";

import { ToastrService } from "ngx-toastr";

import { DimeEnvironmentService } from "../dimeenvironment.service";

@Component({
	selector: "app-dimeenvironment-list",
	templateUrl: "./dimeenvironment-list.component.html",
	styleUrls: ["./dimeenvironment-list.component.css"]
})
export class DimeenvironmentListComponent implements OnInit {

	environmentList: any[];

	constructor(
		private dimeEnvironmentService: DimeEnvironmentService,
		private toastrService: ToastrService,
		private router: Router
	) { }

	ngOnInit() {
		this.getAll();
	}

	getAll() {
		this.dimeEnvironmentService.getAll().subscribe(
			(environmentList: any[]) => {
				this.environmentList = environmentList;
			}, (error) => {
				this.toastrService.error(error);
			}
		)
	}
}
