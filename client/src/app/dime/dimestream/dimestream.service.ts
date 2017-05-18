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
	curItemAssignedFields: any[];
	curItemClean = true;
	curItemDatabaseList = [];
	curItemTableList = [];

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
		this.curItemAssignedFields = [];
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

				// Fix Below
				// this.streamRetrieveFields();


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
				this.router.navigate(["/dime/streams/stream-detail", data.id]);
				this.toastr.info("New item is created, navigating to the details", this.serviceName);
			}, (error) => {
				this.toastr.error("Failed to create new item.", this.serviceName);
				console.log(error);
			});
	}
	update = (curItem?: Stream) => {
		if (!curItem) { curItem = this.curItem };
		this.authHttp.put(this.baseUrl, curItem, { headers: this.headers }).
			map(response => response.json()).
			subscribe(data => {
				this.dataStore.items.forEach((item, index) => {
					if (item.id === data.id) { this.dataStore.items[index] = data; }
				});

				this._items.next(Object.assign({}, this.dataStore).items);
				this.toastr.info("Item is successfully saved.", this.serviceName);
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
				this.curItem = { id: 0, name: "-", type: 0, environment: 0 };
			}, (error) => {
				this.toastr.error("Failed to delete item.", this.serviceName);
				console.log(error);
			});
		} else {
			this.toastr.info("Item deletion is cancelled.", this.serviceName);
		}
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
}

/*
	create() {
		return this.authHttp.post("/api/stream", {}).map(
			(response: Response) => {
				const data = response.json();
				return data;
			}
		).catch(
			(error: Response) => {
				return Observable.throw("Creating a new stream has failed");
			}
			)
	}

	getOne(id: number) {
		return this.authHttp.get("/api/stream/" + id).map(
			(response: Response) => {
				const data = response.json();
				return data;
			}
		).catch(
			(error: Response) => {
				console.log(error);
				return Observable.throw("Fetching the environment has failed");
			}
			);
	}



	update(theStream) {
		const toSend = JSON.stringify(theStream);
		const headers = new Headers({ "Content-Type": "application/json" });
		return this.authHttp.put("/api/stream/" + theStream.id, toSend, { headers: headers }).map((response: Response) => {
			return response.json();
		}).catch((error: Response) => {
			console.log(error);
			console.log("Erred", theStream);
			return Observable.throw("Updating the environment has failed:" + theStream.name);
		});
	}
	delete(id: number) {
		return this.authHttp.delete("/api/stream/" + id).map(
			(response: Response) => {
				const data = response.json();
				return data;
			}
		).catch(
			(error: Response) => {
				console.log(error);
				return Observable.throw("Deleting the stream has failed");
			}
			);
	}
	listFields = (streamID) => {
		return this.authHttp.get("/api/stream/listFields/" + streamID).map((response: Response) => {
			const data = response.json();
			return data;
		}).catch((error: Response) => {
			console.log(error);
			return Observable.throw("Listing the stream fields has failed");
		});
	};
	assignFields = (theStream) => {
		const headers = new Headers({ "Content-Type": "application/json" });
		return this.authHttp.post("/api/stream/assignFields/" + theStream.id, theStream.fields, { headers: headers }).map((response: Response) => {
			return response.json();
		}).catch((error: Response) => {
			console.log(error);
			console.log("Erred", theStream);
			return Observable.throw("Assigning fields has failed: " + error.json().message);
		});
	}
	retrieveFields = (id: number) => {
		return this.authHttp.get("/api/stream/retrieveFields/" + id).map((response: Response) => {
			return response.json();
		}).catch((error: Response) => {
			console.log(error);
			console.log("Erred", id);
			return Observable.throw("Retrieving fields has failed: " + id);
		});
	}
	clearFields = (id: number) => {
		return this.authHttp.get("/api/stream/clearFields/" + id).map((response: Response) => {
			return response.json();
		}).catch((error: Response) => {
			console.log(error);
			console.log("Erred", id);
			return Observable.throw("Clearing fields has failed: " + id);
		});
	}
	saveFields = (refObj: any) => {
		const headers = new Headers({ "Content-Type": "application/json" });
		return this.authHttp.post("/api/stream/saveFields", refObj, {headers: headers}).map((response: Response) => {
			return response.json();
		}).catch((error: Response) => {
			console.log(error);
			console.log("Erred", refObj);
			return Observable.throw("Assigning fields has failed: " + error.json().message);
		});
	}
	listFieldsforField(environmentID: number, field: any) {
		const bodyToSend = { environmentID: environmentID, field: field };
		const headers = new Headers({ "Content-Type": "application/json" });
		return this.authHttp.post("/api/stream/listFieldsforField", bodyToSend, { headers: headers }).map((response: Response) => {
			return response.json();
		}).catch((error: Response) => {
			console.log(error);
			console.log("Erred", environmentID);
			return Observable.throw("Listing description fields has failed: " + field.name);
		});
	}
*/
