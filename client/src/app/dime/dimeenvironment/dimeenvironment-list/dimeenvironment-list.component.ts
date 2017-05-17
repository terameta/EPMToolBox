import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";

import { Observable } from "rxjs/Rx";
import { ToastrService } from "ngx-toastr";

import { DimeEnvironmentService } from "../dimeenvironment.service";
// import { Environment } from "../../../../../../shared/model/environment";

@Component({
	selector: "app-dimeenvironment-list",
	templateUrl: "./dimeenvironment-list.component.html",
	styleUrls: ["./dimeenvironment-list.component.css"]
})
export class DimeenvironmentListComponent implements OnInit {
	// environments: Observable<Environment[]>;

	// environmentList: any[];

	constructor(private environmentService: DimeEnvironmentService) { }

	ngOnInit() {
	}

	// environmentDelete(envID) {
	// 	this.dimeEnvironmentService.delete(envID).subscribe(
	// 		(result) => {
	// 			this.toastr.info("Environment is now deleted. We are now going back to the environment list.");
	// 			this.getAll();
	// 		}, (error) => {
	// 			this.toastr.error(error);
	// 		}
	// 	);
	// }
}
