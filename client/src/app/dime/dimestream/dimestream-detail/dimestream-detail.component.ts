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
	paramsSubscription: Subscription;
	// curStreamClean = true;
	// databaseList = [];
	// tableList = [];
	// curStreamID: number;
	// curStream: any = {};
	// streamTypeList = [];
	// environmentList = [];

	// environmentTypeList = [];
	// curStreamEnvironmentType;

	// pbcsFieldTypes = [
	// 	"Accounts",
	// 	"Entity",
	// 	"Generic",
	// 	"Scenario",
	// 	"Time",
	// 	"Year",
	// 	"Version"
	// ];

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private mainService: DimeStreamService,
		private environmentService: DimeEnvironmentService,
	) { }

	ngOnInit() {
		this.paramsSubscription = this.route.params.subscribe(
			(params: Params) => {
				this.mainService.getOne(params["id"]);
			}
		);
	}

	ngOnDestroy() {
		// this.paramsSubscription.unsubscribe();
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
	/*

		streamFieldsStartOver = () => {
			if (confirm("Are you sure to delete all the assigned fields?")) {
				this.streamService.clearFields(this.curStream.id).subscribe(
					(result) => {
						this.toastr.info("Stream fields are cleared.");
						this.assignedFields = undefined;
						this.sourcedFields = undefined;
					}, (error) => {
						this.toastr.error(error);
						console.error(error);
					}
				);
			}
		}
		streamFieldsSaveChanges = () => {
			this.streamService.saveFields({ id: this.curStream.id, fields: this.assignedFields }).subscribe(
				(result) => {
					this.toastr.info("Stream fields are saved.");
					this.toastr.info("Refreshing field list");
					this.streamRetrieveFields();
				}, (error) => {
					this.toastr.error(error);
					console.error(error);
				}
			);
		}
		streamInitiateFieldsPBCS = () => {
			this.sourcedFields = [
				{ "name": "Account", "type": "Accounts", "order": 1 },
				{ "name": "Period", "type": "Time", "order": 2 },
				{ "name": "Year", "type": "Year", "order": 3 },
				{ "name": "Scenario", "type": "Scenario", "order": 4 },
				{ "name": "Version", "type": "Version", "order": 5 },
				{ "name": "Entity", "type": "Entity", "order": 6 }
			];
		}
		streamSourcedFieldRemove = (curIndex) => {
			this.sourcedFields.splice(curIndex, 1);
			this.sourcedFields.forEach((curField, curKey) => {
				curField.order = curKey + 1;
			});
		}
		streamSourcedFieldAdd = () => {
			this.sourcedFields.push({ name: "", type: "", order: this.sourcedFields.length + 1 });
		}
		streamFieldRefreshTables = (field: any) => {
			if (!field.descriptiveDB) {
				this.toastr.error("Please assign a database to the field description before refreshing the table list");
				return false;
			}
			this.environmentService.listTables(this.curStream.environment, field.descriptiveDB).subscribe(
				(result) => {
					this.toastr.info("Table list is updated");
					this.descriptiveTables[field.descriptiveDB] = result;
				}, (error) => {
					this.toastr.error(error);
				}
			);
		}
		streamFieldGetFields = (field: any) => {
			this.streamService.listFieldsforField(this.curStream.environment, field).subscribe(
				(result) => {
					this.toastr.info("Descriptive fields are refreshed from the server for " + field.name);
					if (!this.descriptiveFields[field.descriptiveDB]) {
						this.descriptiveFields[field.descriptiveDB] = {};
					}
					this.descriptiveFields[field.descriptiveDB][field.descriptiveTable] = result;
					// this.sourcedFields = result;
					// this.sourcedFields.sort(this.streamFieldSortNumeric);
				}, (error) => {
					this.toastr.error(error);
					console.error(error);
				}
			);
		};
		setdrfType(field, event) {
			field.drfType = this.descriptiveFields[field.descriptiveDB][field.descriptiveTable][event.target.selectedIndex].type;
		}
		setddfType(field, event) {
			field.ddfType = this.descriptiveFields[field.descriptiveDB][field.descriptiveTable][event.target.selectedIndex].type;
		}
		*/
}
