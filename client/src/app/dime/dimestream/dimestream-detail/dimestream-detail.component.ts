import { ActivatedRoute, Router, Params } from "@angular/router";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";

import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs/Subscription";

import { DimeStreamService } from "../dimestream.service";
import { DimeEnvironmentService } from "../../dimeenvironment/dimeenvironment.service";

@Component({
	selector: "app-dimestream-detail",
	templateUrl: "./dimestream-detail.component.html",
	styleUrls: ["./dimestream-detail.component.css"]
})
export class DimestreamDetailComponent implements OnInit, OnDestroy {

	curStreamID: number;
	curStream: any = {};
	paramsSubscription: Subscription;
	streamTypeList = [];
	environmentList = [];
	curStreamClean = true;
	databaseList = [];
	tableList = [];
	environmentTypeList = [];
	curStreamEnvironmentType;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private streamService: DimeStreamService,
		private environmentService: DimeEnvironmentService,
		private toastr: ToastrService
	) { }

	ngOnInit() {
		this.paramsSubscription = this.route.params.subscribe(
			(params: Params) => {
				this.curStreamID = params["id"];
				this.streamGetCurrent();
			}
		);
		this.streamService.listTypes().subscribe(
			(typeList) => {
				this.streamTypeList = typeList;
			}, (error) => {
				this.toastr.error(error);
			}
		);
	}

	ngOnDestroy() {
		this.paramsSubscription.unsubscribe();
	}

	private sortByName = (e1, e2) => {
		if (e1.name > e2.name) {
			return 1;
		} else if (e1.name < e2.name) {
			return -1;
		} else {
			return 0;
		}
	}

	streamGetCurrent() {
		this.streamService.getOne(this.curStreamID).subscribe(
			(dbStream) => {
				this.curStream = dbStream;
				this.curStreamClean = true;
				if (this.curStream.dbName && this.databaseList.length === 0) {
					this.databaseList.push({ name: this.curStream.dbName });
				}
				if (this.tableList.length === 0) {
					if (this.curStream.tableName && this.curStream.tableName !== "Custom Query") {
						this.tableList.push({ name: this.curStream.tableName, type: "-" });
					}
					this.tableList.push({ name: "Custom Query", type: "Custom Query" });
				}

				this.environmentService.getAll().subscribe(
					(curEnvList) => {
						this.environmentList = curEnvList;
						this.environmentList.sort(this.sortByName);
						this.environmentService.listTypes().subscribe(
							(curTypeList) => {
								this.environmentTypeList = curTypeList;
								this.environmentList.forEach((curEnv) => {
									if (parseInt(curEnv.id, 10) === parseInt(this.curStream.environment, 10)) {
										this.environmentTypeList.forEach((curType) => {
											if (parseInt(curEnv.type, 10) === parseInt(curType.id, 10)) {
												this.curStreamEnvironmentType = curType.value;
											}
										});
									}
								});
							}, (error) => {
								this.toastr.error(error);
							}
						);
					}, (error) => {
						this.toastr.error(error);
					}
				);
			}, (error) => {
				this.toastr.error(error);
			}
		);
	}

	streamSave(form: NgForm) {
		this.streamService.update(this.curStream).subscribe(
			(result) => {
				this.toastr.info("Information updated");
				this.streamGetCurrent();
			}, (error) => {
				this.toastr.error(error);
			}
		);
	}

	streamRefreshDatabases() {
		if (!this.curStreamClean) {
			this.toastr.error("Please save the stream before refreshing database list");
			return false;
		}
		this.environmentService.listDatabases(this.curStream.environment).subscribe(
			(result) => {
				this.toastr.info("Database list is updated");
				this.databaseList = result;
			}, (error) => {
				this.toastr.error(error);
			}
		);
	}

	streamRefreshTables() {
		if (!this.curStreamClean) {
			this.toastr.error("Please save the stream before refreshing the table list");
			return false;
		}
		this.environmentService.listTables(this.curStream.environment, this.curStream.dbName).subscribe(
			(result) => {
				this.toastr.info("Table list is updated");
				console.log(result);
				this.tableList = result;
			}, (error) => {
				this.toastr.error(error);
			}
		);
	}

	streamDelete(streamID) {
		this.streamService.delete(streamID).subscribe(
			(result) => {
				this.toastr.info("Stream is now deleted. We are now going back to the stream list.");
				this.router.navigate(["/dime/streams/stream-list"]);
			}, (error) => {
				this.toastr.error(error);
			}
		);
	}
	streamGetFields = (streamID: number) => {
		this.streamService.listFields(streamID).subscribe(
			(result) => {
				this.toastr.info("Stream fields are refreshed from the server");
				this.curStream.sourcedFields = result;
			}, (error) => {
				this.toastr.error(error);
				console.error(error);
			}
		)
	};
}
