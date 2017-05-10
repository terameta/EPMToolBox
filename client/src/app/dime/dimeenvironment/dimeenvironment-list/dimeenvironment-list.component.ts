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
		private toastr: ToastrService,
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
				this.toastr.error(error);
			}
		)
	}

	environmentDelete(envID) {
		this.dimeEnvironmentService.delete(envID).subscribe(
			(result) => {
				this.toastr.info("Environment is now deleted. We are now going back to the environment list.");
				this.getAll();
			}, (error) => {
				this.toastr.error(error);
			}
		);
	}
}
