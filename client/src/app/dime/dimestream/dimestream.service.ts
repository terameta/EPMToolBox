import { ActivatedRoute, Router } from "@angular/router";
import { Headers, Http, Response } from "@angular/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/Rx";
import { AuthHttp } from "angular2-jwt";
import { ToastrService } from "ngx-toastr/toastr/toastr-service";

import { DimeEnvironmentService } from "../dimeenvironment/dimeenvironment.service";
import { Stream } from "../../../../../shared/model/stream";
import { StreamType } from "../../../../../shared/model/streamtype";

@Injectable()
export class DimeStreamService {
	items: Observable<Stream[]>;
	typeList: StreamType[];
	private _items: BehaviorSubject<Stream[]>;
	private baseUrl: string;
	private dataStore: {
		items: Stream[]
	};
	private headers = new Headers({ "Content-Type": "application/json" });
	private serviceName: string;

	// CurItem Related Information all together
	curItem: Stream;
	curItemEnvironmentType: string;
	curItemSourcedFields: any[];
	curItemAssignedFields: any[];
	curItemClean = true;
	curItemDatabaseList = [];
	curItemTableList = [];

	// Field detail related information all together
	descriptiveTables: any = {};
	descriptiveFields: any = {};

	pbcsFieldTypes = [
		"Accounts",
		"Entity",
		"Generic",
		"Scenario",
		"Time",
		"Year",
		"Version"
	];

	constructor(
		private http: Http,
		private authHttp: AuthHttp,
		private toastr: ToastrService,
		private router: Router,
		private route: ActivatedRoute,
		private environmentService: DimeEnvironmentService
	) {
		this.baseUrl = "/api/dime/stream";
		this.serviceName = "Streams";
		this.dataStore = { items: [] };
		this._items = <BehaviorSubject<Stream[]>>new BehaviorSubject([]);
		this.items = this._items.asObservable();
		this.curItem = { id: 0, name: "-", type: 0, environment: 0 };
		this.typeList = [];
		this.getAll(true);
		this.curItemEnvironmentType = "";
		this.curItemAssignedFields = undefined;
		this.curItemSourcedFields = undefined;
	}

	getAll = (isSilent?: boolean) => {
		if (this.typeList.length === 0) { this.listTypes(); }
		this.authHttp.get(this.baseUrl).
			map((response) => {
				return response.json();
			}).
			subscribe((data) => {
				this.dataStore.items = data;
				this._items.next(Object.assign({}, this.dataStore).items);
				if (!isSilent) { this.toastr.info("Items are loaded.", this.serviceName); }
			}, (error) => {
				this.toastr.error("Failed to load items.", this.serviceName);
				console.log(error);
			});
	}
	getOne = (id: number) => {
		if (this.typeList.length === 0) { this.listTypes(); }
		this.authHttp.get(this.baseUrl + "/" + id).
			map(response => response.json()).
			subscribe((data) => {
				let notFound = true;

				this.dataStore.items.forEach((item, index) => {
					if (item.id === data.id) {
						this.dataStore.items[index] = data;
						notFound = false;
					}
				});

				if (notFound) {
					this.dataStore.items.push(data);
				}

				this._items.next(Object.assign({}, this.dataStore).items);
				this.curItem = data;
				this.curItemClean = true;
				this.setCurItemEnvironmentType();

				if (this.curItem.dbName && this.curItemDatabaseList.length === 0) {
					this.curItemDatabaseList.push({ name: this.curItem.dbName });
				}
				if (this.curItemTableList.length === 0) {
					if (this.curItem.tableName && this.curItem.tableName !== "Custom Query") {
						this.curItemTableList.push({ name: this.curItem.tableName, type: "-" });
					}
					this.curItemTableList.push({ name: "Custom Query", type: "Custom Query" });
				}
				this.retrieveFields();
			}, (error) => {
				this.toastr.error("Failed to get the item.", this.serviceName);
				console.log(error);
			});
	}
	private setCurItemEnvironmentType = () => {
		if (this.environmentService.typeList.length === 0) {
			setTimeout(this.setCurItemEnvironmentType, 1000);
		} else {
			this.environmentService.items.subscribe((environments) => {
				environments.forEach((curEnv) => {
					if (curEnv.id.toString() === this.curItem.environment.toString()) {
						this.environmentService.typeList.forEach((curType) => {
							if (parseInt(curEnv.type.toString(), 10) === parseInt(curType.id.toString(), 10)) { this.curItemEnvironmentType = curType.value; }
						});
					}
				});
			});
		}
	}
	create = () => {
		this.authHttp.post(this.baseUrl, {}, { headers: this.headers })
			.map(response => response.json()).subscribe(data => {
				this.dataStore.items.push(data);
				this._items.next(Object.assign({}, this.dataStore).items);
				this.resetCurItem();
				this.router.navigate(["/dime/streams/stream-detail", data.id]);
				this.toastr.info("New item is created, navigating to the details", this.serviceName);
			}, (error) => {
				this.toastr.error("Failed to create new item.", this.serviceName);
				console.log(error);
			});
	}
	update = (curItem?: Stream) => {
		let shouldUpdate = false;
		if (!curItem) { curItem = this.curItem; shouldUpdate = true; };
		this.authHttp.put(this.baseUrl, curItem, { headers: this.headers }).
			map(response => response.json()).
			subscribe(data => {
				this.dataStore.items.forEach((item, index) => {
					if (item.id === data.id) { this.dataStore.items[index] = data; }
				});

				this._items.next(Object.assign({}, this.dataStore).items);
				this.toastr.info("Item is successfully saved.", this.serviceName);
				// If the update request came from another source, then it is an ad-hoc save of a non-current stream.
				// This shouldn't change the state of the current item.
				if (shouldUpdate) { this.curItemClean = true; }
			}, error => {
				this.toastr.error("Failed to save the item.", this.serviceName);
				console.log(error);
			});
	}
	delete(id: number, name?: string) {
		const verificationQuestion = this.serviceName + ": Are you sure you want to delete " + (name !== undefined ? name : "the item") + "?";
		if (confirm(verificationQuestion)) {
			this.authHttp.delete(this.baseUrl + "/" + id).subscribe(response => {
				this.dataStore.items.forEach((item, index) => {
					if (item.id === id) { this.dataStore.items.splice(index, 1); }
				});

				this._items.next(Object.assign({}, this.dataStore).items);
				this.toastr.info("Item is deleted.", this.serviceName);
				this.router.navigate(["/dime/streams/stream-list"]);
				this.resetCurItem();
			}, (error) => {
				this.toastr.error("Failed to delete item.", this.serviceName);
				console.log(error);
			});
		} else {
			this.toastr.info("Item deletion is cancelled.", this.serviceName);
		}
	}
	private resetCurItem = () => {
		this.curItem = { id: 0, name: "-", type: 0, environment: 0 };
		this.curItemAssignedFields = undefined;
		this.curItemSourcedFields = undefined;
		this.curItemDatabaseList = [];
		this.curItemTableList = [];
	}
	private listTypes() {
		return this.authHttp.get(this.baseUrl + "/listTypes").
			map(response => response.json()).
			subscribe((data) => {
				this.typeList = data;
			}, (error) => {
				this.toastr.error("Listing types has failed", this.serviceName);
			});
	}
	public refreshDatabases() {
		if (!this.curItemClean) {
			this.toastr.error("Please save your changes before refreshing database list");
			return false;
		}
		this.environmentService.listDatabases(this.curItem.environment).subscribe(
			(result) => {
				this.toastr.info("Database list is updated", this.serviceName);
				this.curItemDatabaseList = result;
			}, (error) => {
				this.toastr.error("Failed to refresh databases.", this.serviceName);
				console.log(error);
			}
		);
	}
	public refreshTables() {
		if (!this.curItemClean) {
			this.toastr.error("Please save your changes before refreshing the table list");
			return false;
		}
		this.environmentService.listTables(this.curItem.environment, this.curItem.dbName).subscribe(
			(result) => {
				this.toastr.info("Table list is updated.", this.serviceName);
				this.curItemTableList = result;
			}, (error) => {
				this.toastr.error("Failed to refresh databases.", this.serviceName);
				console.log(error);
			}
		);
	}
	public listFieldsFromSourceEnvironment = (id: number) => {
		this.authHttp.get(this.baseUrl + "/listFields/" + id).
			map(response => response.json()).
			subscribe((data) => {
				this.toastr.info("Successfully listed fields from the source environment.", this.serviceName);
				this.curItemSourcedFields = data;
				this.curItemSourcedFields.sort(this.fieldSortNumeric);
			}, (error) => {
				this.toastr.error("Failed to list fields from the source environment.", this.serviceName);
				console.log(error);
			});
	};
	private fieldSortNumeric = (f1, f2): number => {
		let fItem: string;
		if (f1.order) { fItem = "order" };
		if (f1.fOrder) { fItem = "fOrder" };
		if (f1.pOrder) { fItem = "pOrder" };
		if (parseInt(f1[fItem], 10) > parseInt(f2[fItem], 10)) {
			return 1;
		} else if (parseInt(f1[fItem], 10) < parseInt(f2[fItem], 10)) {
			return -1;
		} else {
			return 0;
		}
	}
	public fieldMove = (theFieldList: any[], theField, direction) => {
		const curOrder = theField.order || theField.fOrder || theField.pOrder;
		const nextOrder = parseInt(curOrder, 10) + (direction === "down" ? 1 : -1);
		theFieldList.forEach((curField) => {
			if (parseInt(curField.order, 10) === nextOrder) { curField.order = curOrder; }
			if (parseInt(curField.fOrder, 10) === nextOrder) { curField.fOrder = curOrder; }
			if (parseInt(curField.pOrder, 10) === nextOrder) { curField.pOrder = curOrder; }
		});
		if (theField.order) { theField.order = nextOrder; }
		if (theField.fOrder) { theField.fOrder = nextOrder; }
		if (theField.pOrder) { theField.pOrder = nextOrder; }
		theFieldList.sort(this.fieldSortNumeric);
	}
	public assignFields = (refObj: { id: number, fieldList: any[] }) => {
		if (!refObj) {
			refObj = { id: 0, fieldList: [] };
			refObj.id = this.curItem.id;
			refObj.fieldList = this.curItemSourcedFields;
		}
		this.authHttp.post(this.baseUrl + "/assignFields/" + refObj.id, refObj.fieldList, { headers: this.headers }).
			map(response => response.json()).
			subscribe((data) => {
				this.toastr.info("Stream fields are assigned.", this.serviceName);
				this.toastr.info("Refreshing the assigned fields.", this.serviceName);
				this.retrieveFields();
				this.curItemSourcedFields = undefined;
			}, (error) => {
				this.toastr.error("Failed to assign fields to the item.", this.serviceName);
				console.log(error);
			});
	};
	public retrieveFields = () => {
		this.authHttp.get(this.baseUrl + "/retrieveFields/" + this.curItem.id).
			map(response => response.json()).
			subscribe((data) => {
				this.toastr.info("Stream assigned fields are retrieved.", this.serviceName);
				if (data.length > 0) {
					this.curItemAssignedFields = data;
					this.curItemAssignedFields.forEach((curField) => {
						if (curField.isDescribed && curField.descriptiveDB && curField.descriptiveTable) {
							if (!this.descriptiveTables[curField.descriptiveDB]) {
								this.descriptiveTables[curField.descriptiveDB] = [];
							}
							// this.descriptiveTables[curField.descriptiveDB].push({ name: curField.descriptiveTable, type: "-" }, { name: "Custom Query", type: "-" });
							if (this.descriptiveTables[curField.descriptiveDB].indexOf({ name: curField.descriptiveTable, type: "-" }) < 0) {
								this.descriptiveTables[curField.descriptiveDB].push({ name: curField.descriptiveTable, type: "-" });
							}
							if (this.descriptiveTables[curField.descriptiveDB].indexOf({ name: "Custom Query", type: "-" }) < 0) {
								this.descriptiveTables[curField.descriptiveDB].push({ name: "Custom Query", type: "-" });
							}

							if (!this.descriptiveFields[curField.descriptiveDB]) {
								this.descriptiveFields[curField.descriptiveDB] = {};
							}
							if (!this.descriptiveFields[curField.descriptiveDB][curField.descriptiveTable]) {
								this.descriptiveFields[curField.descriptiveDB][curField.descriptiveTable] = [];
								if (curField.drfName) { this.descriptiveFields[curField.descriptiveDB][curField.descriptiveTable].push({ name: curField.drfName, type: curField.drfType }) };
								if (curField.ddfName) { this.descriptiveFields[curField.descriptiveDB][curField.descriptiveTable].push({ name: curField.ddfName, type: curField.ddfType }) };
							}
						}
					})
				}
			}, (error) => {
				this.toastr.error("Failed to retrieve assigned field list for the stream.", this.serviceName);
				console.log(error);
			});
	}
	public fieldsStartOver = (id?: number) => {
		if (!id) { id = this.curItem.id };
		if (confirm("Are you sure to delete all the assigned fields?")) {
			this.authHttp.get(this.baseUrl + "/clearFields/" + id).
				map(response => response.json).
				subscribe((result) => {
					this.toastr.info("Assigned filders are cleared.", this.serviceName);
					this.curItemAssignedFields = undefined;
					this.curItemSourcedFields = undefined;
				}, (error) => {
					this.toastr.error("Failed to delete the assigned fields.", this.serviceName);
					console.log(error);
				});
		}
	}
	public fieldsSave = (refObj: { id: number, fields: any[] }) => {
		if (!refObj) {
			refObj = { id: 0, fields: [] };
			refObj.id = this.curItem.id;
			refObj.fields = this.curItemAssignedFields;
		}
		this.authHttp.post(this.baseUrl + "/saveFields", refObj, { headers: this.headers }).
			map(response => response.json()).
			subscribe((result) => {
				this.toastr.info("Fields are saved.", this.serviceName);
				this.toastr.info("Refreshing field list.", this.serviceName);
				this.retrieveFields();
			}, (error) => {
				this.toastr.error("Failed to save fields.", this.serviceName);
				console.log(error);
			});
	}
	public fieldsInitiateForPBCS = () => {
		this.curItemSourcedFields = [
			{ "name": "Account", "type": "Accounts", "order": 1 },
			{ "name": "Period", "type": "Time", "order": 2 },
			{ "name": "Year", "type": "Year", "order": 3 },
			{ "name": "Scenario", "type": "Scenario", "order": 4 },
			{ "name": "Version", "type": "Version", "order": 5 },
			{ "name": "Entity", "type": "Entity", "order": 6 }
		];
	}
	public fieldsAddtoPBCS = () => {
		this.curItemSourcedFields.push({ name: "", type: "", order: this.curItemSourcedFields.length + 1 });
	}
	public fieldsRemoveFromPBCS = (curIndex) => {
		this.curItemSourcedFields.splice(curIndex, 1);
		this.curItemSourcedFields.forEach((curField, curKey) => {
			curField.order = curKey + 1;
		});
	}
	public fieldRefreshTables = (field: any) => {
		if (!field.descriptiveDB) {
			this.toastr.error("Please assign a database to the field description before refreshing the table list");
			return false;
		}
		this.environmentService.listTables(this.curItem.environment, field.descriptiveDB).subscribe(
			(result) => {
				this.toastr.info("Table list is updated");
				this.descriptiveTables[field.descriptiveDB] = result;
			}, (error) => {
				this.toastr.error("Failed to refresh table list.", this.serviceName);
				console.log(error);
			}
		);
	};
	public fieldListDescriptiveFields = (field: any) => {
		const bodyToSend = { environmentID: this.curItem.environment, field: field };
		this.authHttp.post(this.baseUrl + "/listFieldsforField", bodyToSend, { headers: this.headers }).
			map(response => response.json()).
			subscribe((result) => {
				this.toastr.info("Descriptive fields are refreshed from the server for " + field.name, this.serviceName);
				if (!this.descriptiveFields[field.descriptiveDB]) {
					this.descriptiveFields[field.descriptiveDB] = {};
				}
				this.descriptiveFields[field.descriptiveDB][field.descriptiveTable] = result;
			}, (error) => {
				this.toastr.error("Failed to refresh descriptive fields.", this.serviceName);
				console.log(error);
			});
	};
	setdrfType(field, event) {
		field.drfType = this.descriptiveFields[field.descriptiveDB][field.descriptiveTable][event.target.selectedIndex].type;
	}
	setddfType(field, event) {
		field.ddfType = this.descriptiveFields[field.descriptiveDB][field.descriptiveTable][event.target.selectedIndex].type;
	}
}
