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
		this.environmentService.getAll().subscribe(
			(curEnvList) => {
				this.environmentList = curEnvList;
				this.environmentList.sort(this.sortByName);
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
				if (this.curStream.tableName && this.tableList.length === 0) {
					this.tableList.push({ name: this.curStream.tableName, type: "-" });
				}
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
	/*






		streamVerify() {
			this.streamService.verify(this.curStreamID).subscribe(
				(result) => {
					this.toastr.info("Stream is now verified. We are now refreshing the view.");
					this.streamGetCurrent();
				}, (error) => {
					this.toastr.error(error);
				}
			);
		}

		streamDelete(envID) {
			this.streamService.delete(envID).subscribe(
				(result) => {
					this.toastr.info("Stream is now deleted. We are now going back to the stream list.");
					this.router.navigate(["/dime/streams/stream-list"]);
				}, (error) => {
					this.toastr.error(error);
				}
			);
		}
	*/
}
