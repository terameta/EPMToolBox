import { ActivatedRoute, Router, Params } from "@angular/router";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";

import { Subscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Rx";

import { DimeEnvironmentService } from "../dimeenvironment.service";

// import { DimeEnvironment } from "../../../../../../shared/model/dime/environment";

@Component( {
	selector: "app-dimeenvironment-detail",
	templateUrl: "./dimeenvironment-detail.component.html",
	styleUrls: ["./dimeenvironment-detail.component.css"]
} )
export class DimeenvironmentDetailComponent implements OnInit, OnDestroy {
	// curItem: Environment;
	paramsSubscription: Subscription;

	// curEnvironmentID: number;
	// curEnvironment: any = {};

	constructor(
		private route: ActivatedRoute,
		public mainService: DimeEnvironmentService
	) { }

	ngOnInit() {
		// this.curItem = { id: 0 };
		this.paramsSubscription = this.route.params.subscribe(
			( params: Params ) => {
				this.mainService.getOne( params["id"] );
			}
		);
	}

	ngOnDestroy() {
		this.mainService.curItem = { id: 0 };
	}
}
