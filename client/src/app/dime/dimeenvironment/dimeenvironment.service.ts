import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { Router } from "@angular/router";

import { BehaviorSubject, Observable } from "rxjs/Rx";
import { AuthHttp } from "angular2-jwt";
import { ToastrService } from "ngx-toastr";

import { Environment } from "../../../../../shared/model/environment";

@Injectable()
export class DimeEnvironmentService {
	items: Observable<Environment[]>;
	private _items: BehaviorSubject<Environment[]>;
	private baseUrl: string;
	private dataStore: {
		items: Environment[]
	};
	private headers = new Headers({ "Content-Type": "application/json" });
	private serviceName: string;

	constructor(private http: Http, private authHttp: AuthHttp, private toastr: ToastrService, private router: Router) {
		this.baseUrl = "/api/dime/environment";
		this.serviceName = "Environments";
		this.dataStore = { items: [] };
		this._items = <BehaviorSubject<Environment[]>>new BehaviorSubject([]);
		this.items = this._items.asObservable();
	}

	getAll = () => {
		this.authHttp.get(this.baseUrl).
			map((response) => {
				return response.json();
			}).
			subscribe((data) => {
				this.dataStore.items = data;
				this._items.next(Object.assign({}, this.dataStore).items);
				this.toastr.info("Items are loaded.", this.serviceName);
			}, (error) => {
				this.toastr.error("Failed to load items.", this.serviceName);
				console.log(error);
			});
	}
	getOne = (id: number) => {
		this.authHttp.get(this.baseUrl + "/" + id).map(response => response.json()).subscribe(data => {
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
		}, error => console.log("Could not load map."));
	}
	create = () => {
		this.authHttp.post(this.baseUrl, { name: "New Map" }, { headers: this.headers })
			.map(response => response.json()).subscribe(data => {
				this.dataStore.items.push(data);
				this._items.next(Object.assign({}, this.dataStore).items);
				this.router.navigate(["/dime/environments/environment-detail", data.id]);
				this.toastr.info("New item is created, navigating to the details", this.serviceName);
			}, (error) => {
				this.toastr.error("Failed to create new item.", this.serviceName);
				console.log(error);
			});
	}
	update = (dimeMap: Environment) => {
		this.authHttp.put(this.baseUrl + "/" + dimeMap.id, dimeMap, { headers: this.headers })
			.map(response => response.json()).subscribe(data => {
				this.dataStore.items.forEach((item, index) => {
					if (item.id === data.id) { this.dataStore.items[index] = data; }
				});

				this._items.next(Object.assign({}, this.dataStore).items);
			}, error => console.log("Could not update map."));
	}
	delete(id: number, name?: string) {
		console.log(name);
		const verificationQuestion = this.serviceName + ": Are you sure you want to delete " + (name !== undefined ? name : "the item") + "?";
		if (confirm(verificationQuestion)) {
			this.authHttp.delete(this.baseUrl + "/" + id).subscribe(response => {
				this.dataStore.items.forEach((item, index) => {
					if (item.id === id) { this.dataStore.items.splice(index, 1); }
				});

				this._items.next(Object.assign({}, this.dataStore).items);
				this.toastr.info("Item is deleted.", this.serviceName);
			}, (error) => {
				this.toastr.error("Failed to delete item.", this.serviceName);
				console.log(error);
			});
		} else {
			this.toastr.info("Item deletion is cancelled.", this.serviceName);
		}
	}
}
/*import { Headers, Http, Response } from "@angular/http";
import { Injectable } from "@angular/core";

import "rxjs/Rx";
import { BehaviorSubject, Observable } from "rxjs/Rx";
import { AuthHttp } from "angular2-jwt";
import { ToastrService } from "ngx-toastr";

import { Environment } from "../../../../../shared/model/environment";


@Injectable()
export class DimeEnvironmentService {
	environments: Observable<Environment[]>;
	private _environments: BehaviorSubject<Environment[]>;
	private baseUrl: string;
	private dataStore: {
		environments: Environment[]
	};
	private headers = new Headers({ "Content-Type": "application/json" });

	constructor(private http: Http, private authHttp: AuthHttp, private toastr: ToastrService) {
		this.baseUrl = "/api/dime/environment";
		this.dataStore = { environments: [] };
		this._environments = <BehaviorSubject<Environment[]>>new BehaviorSubject([]);
		this.environments = this._environments.asObservable();
	}

	getAll() {
		this.authHttp.get(this.baseUrl).
			map((response) => {
				return response.json();
			}).
			subscribe((data) => {
				this.dataStore.environments = data;
				this._environments.next(Object.assign({}, this.dataStore).environments);
				this.toastr.info("Environment list is received.");
			}, (error) => {
				console.log(error);
				this.toastr.error("Failed to receive environment list.");
				console.log("Could not load environments.");
			});
	}

	create() {
		return this.authHttp.post("/api/environment", {}).map(
			(response: Response) => {
				const data = response.json();
				return data;
			}
		).catch(
			(error: Response) => {
				return Observable.throw("Creating a new environment has failed");
			}
			)
	}

	getOne(id: number) {
		return this.authHttp.get("/api/environment/" + id).map(
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

	update(theEnvironment) {
		const toSend = JSON.stringify(theEnvironment);
		const headers = new Headers({ "Content-Type": "application/json" });
		return this.authHttp.put("/api/environment/" + theEnvironment.id, toSend, { headers: headers }).map((response: Response) => {
			return response.json();
		}).catch((error: Response) => {
			console.log(error);
			console.log("Erred", theEnvironment);
			return Observable.throw("Updating the environment has failed:" + theEnvironment.name);
		});
	}

	delete(id: number) {
		return this.authHttp.delete("/api/environment/" + id).map(
			(response: Response) => {
				const data = response.json();
				return data;
			}
		).catch(
			(error: Response) => {
				console.log(error);
				return Observable.throw("Deleting the environment has failed");
			}
			);
	}

	listTypes() {
		return this.authHttp.get("/api/environment/listTypes").map((response: Response) => {
			const data = response.json();
			return data;
		}).catch((error: Response) => {
			console.log(error);
			return Observable.throw("Fetching environment type list has failed");
		});
	}

	verify(environmentID: number) {
		return this.authHttp.get("/api/environment/verify/" + environmentID).map((response: Response) => {
			return response.json();
		}).catch((error: Response) => {
			console.log(error);
			return Observable.throw("Environment verification has failed");
		});
	}

	listDatabases(environmentID: number) {
		return this.authHttp.get("/api/environment/listDatabases/" + environmentID).map((response: Response) => {
			return response.json();
		}).catch((error: Response) => {
			console.log(error);
			return Observable.throw("Listing environment databases has failed");
		});
	}
	listTables(environmentID: number, dbName: string) {
		return this.authHttp.get("/api/environment/listTables/" + environmentID + "/" + dbName).map((response: Response) => {
			return response.json();
		}).catch((error: Response) => {
			console.log(error);
			return Observable.throw("Listing environment tables has failed");
		});
	}
}
*/
