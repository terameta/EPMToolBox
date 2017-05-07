import { Component, OnInit } from "@angular/core";

import { ToastrService } from "ngx-toastr";

import { DimeEnvironmentService } from "../dimeenvironment.service";


@Component({
	selector: "app-dimeenvironment-toolbar",
	templateUrl: "./dimeenvironment-toolbar.component.html",
	styleUrls: ["./dimeenvironment-toolbar.component.css"]
})
export class DimeenvironmentToolbarComponent implements OnInit {

	constructor(
		private dimeEnvironmentService: DimeEnvironmentService,
		private toastr: ToastrService
	) { }

	ngOnInit() {
	}

	create() {
		this.dimeEnvironmentService.create().subscribe(
			(result: any) => {
				this.toastr.info(result);
				console.log(result);
			}, (error) => {
				this.toastr.error(error);
			}
		)
	}

}
