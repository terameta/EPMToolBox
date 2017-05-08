import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { ToastrService } from "ngx-toastr";

import { DimeEnvironmentService } from "../dimeenvironment.service";


@Component({
	selector: "app-dimeenvironment-toolbar",
	templateUrl: "./dimeenvironment-toolbar.component.html",
	styleUrls: ["./dimeenvironment-toolbar.component.css"]
})
export class DimeenvironmentToolbarComponent implements OnInit {
	environmentList: any[];

	constructor(
		private environmentService: DimeEnvironmentService,
		private toastr: ToastrService,
		private router: Router
	) { }

	ngOnInit() {
		this.getAll();
	}

	getAll() {
		this.environmentService.getAll().subscribe(
			(environmentList: any[]) => {
				this.environmentList = environmentList;
			}, (error) => {
				this.toastr.error(error);
			}
		)
	}

	create() {
		this.environmentService.create().subscribe(
			(result: any) => {
				this.router.navigate(["/dime/environments/environment-detail", result.id]);
				this.toastr.info("New environment is created, navigating to the details");
			}, (error) => {
				this.toastr.error(error);
			}
		)
	}

}
