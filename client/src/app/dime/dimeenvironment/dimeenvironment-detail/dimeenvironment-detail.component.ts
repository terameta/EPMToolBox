import { ActivatedRoute, Params } from "@angular/router";
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
		private environmentService: DimeEnvironmentService,
		private toastr: ToastrService
	) { }

	ngOnInit() {
		this.paramsSubscription = this.route.params.subscribe(
			(params: Params) => {
				this.curEnvironmentID = params["id"];
				this.environmentService.getOne(params["id"]).subscribe(
					(dbEnvironment) => {
						this.curEnvironment = dbEnvironment;
					}, (error) => {
						this.toastr.error(error);
					}
				);
			}
		)
		this.environmentService.listTypes().subscribe(
			(typeList) => {
				this.environmentTypeList = typeList;
			}, (error) => {
				this.toastr.error(error);
			}
		);
	}

	ngOnDestroy() {
		this.paramsSubscription.unsubscribe();
	}

	saveEnvironment(form: NgForm) {
		console.log("This works");
		console.log(form.value);
	}

}
