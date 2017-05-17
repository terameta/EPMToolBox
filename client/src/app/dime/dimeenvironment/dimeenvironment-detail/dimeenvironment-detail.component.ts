import { ActivatedRoute, Router, Params } from "@angular/router";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";

import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs/Subscription";

import { DimeEnvironmentService } from "../dimeenvironment.service";

@Component({
	selector: "app-dimeenvironment-detail",
	templateUrl: "./dimeenvironment-detail.component.html",
	styleUrls: ["./dimeenvironment-detail.component.css"]
})
export class DimeenvironmentDetailComponent implements OnInit, OnDestroy {

	curEnvironmentID: number;
	curEnvironment: any = {};
	paramsSubscription: Subscription;
	environmentTypeList = [];

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private environmentService: DimeEnvironmentService,
		private toastr: ToastrService
	) { }

	ngOnInit() {
		/*this.paramsSubscription = this.route.params.subscribe(
			(params: Params) => {
				this.curEnvironmentID = params["id"];
				this.environmentGetCurrent();
			}
		);
		this.environmentService.listTypes().subscribe(
			(typeList) => {
				this.environmentTypeList = typeList;
			}, (error) => {
				this.toastr.error(error);
			}
		);*/
	}

	ngOnDestroy() {
		this.paramsSubscription.unsubscribe();
	}
/*
	isPBCS() {
		let toReturn = false;
		if (this.curEnvironment.type) {
			this.environmentTypeList.forEach((curType) => {
				if (parseInt(this.curEnvironment.type, 10) === parseInt(curType.id, 10) && curType.value === "PBCS") {
					toReturn = true;
				}
			});
		}
		return toReturn;
	}

	environmentSave(form: NgForm) {
		this.environmentService.update(this.curEnvironment).subscribe(
			(result) => {
				this.toastr.info("Information updated");
			}, (error) => {
				this.toastr.error(error);
			}
		);
	}

	environmentGetCurrent() {
		this.environmentService.getOne(this.curEnvironmentID).subscribe(
			(dbEnvironment) => {
				this.curEnvironment = dbEnvironment;
			}, (error) => {
				this.toastr.error(error);
			}
		);
	}

	environmentVerify() {
		this.environmentService.verify(this.curEnvironmentID).subscribe(
			(result) => {
				this.toastr.info("Environment is now verified. We are now refreshing the view.");
				this.environmentGetCurrent();
			}, (error) => {
				this.toastr.error(error);
			}
		);
	}

	environmentDelete(envID) {
		this.environmentService.delete(envID).subscribe(
			(result) => {
				this.toastr.info("Environment is now deleted. We are now going back to the environment list.");
				this.router.navigate(["/dime/environments/environment-list"]);
			}, (error) => {
				this.toastr.error(error);
			}
		);
	}
*/
}
