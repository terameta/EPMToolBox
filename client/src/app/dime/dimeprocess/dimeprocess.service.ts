import { ActivatedRoute, Router } from "@angular/router";
import { Headers, Http, Response } from "@angular/http";
import { Injectable } from "@angular/core";

import { ToastrService } from "ngx-toastr/toastr/toastr-service";
import { BehaviorSubject } from "rxjs/Rx";
import "rxjs/Rx";
import { Observable } from "rxjs/Observable";
import { AuthHttp } from "angular2-jwt";

import { DimeProcess } from "../../../../../shared/model/dime/process";
import { DimeProcessStep } from "../../../../../shared/model/dime/processstep";

@Injectable()
export class DimeProcessService {
	items: Observable<DimeProcess[]>;
	curItem: DimeProcess;
	curItemIsReady: boolean;
	curItemSteps: DimeProcessStep[];
	curItemClean: boolean;
	private serviceName: string;
	private _items: BehaviorSubject<DimeProcess[]>;
	private baseUrl: string;
	private dataStore: {
		items: DimeProcess[]
	};
	private headers = new Headers({ "Content-Type": "application/json" });

	constructor(
		private http: Http,
		private authHttp: AuthHttp,
		private toastr: ToastrService,
		private router: Router,
		private route: ActivatedRoute
	) {
		this.baseUrl = "/api/dime/process";
		this.dataStore = { items: [] };
		this._items = <BehaviorSubject<DimeProcess[]>>new BehaviorSubject([]);
		this.items = this._items.asObservable();
		this.serviceName = "Processes";
		this.resetCurItem();
	}

	getAll = () => {
		this.authHttp.get(this.baseUrl).
			map((response) => {
				return response.json();
			}).
			subscribe((data) => {
				data.sort(this.sortByName);
				this.dataStore.items = data;
				this._items.next(Object.assign({}, this.dataStore).items);
			}, (error) => {
				this.toastr.error("Failed to load items.", this.serviceName);
				console.log(error);
			});
	}
	getOne = (id: number) => {
		this.authHttp.get(this.baseUrl + "/" + id).
			map(response => response.json()).
			subscribe((result) => {
				let notFound = true;

				this.dataStore.items.forEach((item, index) => {
					if (item.id === result.id) {
						this.dataStore.items[index] = result;
						notFound = false;
					}
				});

				if (notFound) {
					this.dataStore.items.push(result);
				}

				this.dataStore.items.sort(this.sortByName);
				this._items.next(Object.assign({}, this.dataStore).items);
				this.curItem = result;
				this.curItemClean = true;
				this.isReady(this.curItem.id);
			}, (error) => {
				this.toastr.error("Failed to get the item.", this.serviceName);
				console.log(error);
			});
	}
	create = () => {
		this.authHttp.post(this.baseUrl, {}, { headers: this.headers }).
			map(response => response.json()).
			subscribe((result) => {
				this.dataStore.items.push(result);
				this.dataStore.items.sort(this.sortByName);
				this._items.next(Object.assign({}, this.dataStore).items);
				this.resetCurItem();
				this.router.navigate(["/dime/processes/process-detail", result.id]);
				this.toastr.info("New item is created, navigating to the details", this.serviceName);
			}, (error) => {
				this.toastr.error("Failed to create new item.", this.serviceName);
				console.log(error);
			}
			);
	};
	update = (curItem?: DimeProcess) => {
		let shouldUpdate = false;
		if (!curItem) { curItem = this.curItem; shouldUpdate = true; };
		this.authHttp.put(this.baseUrl, curItem, { headers: this.headers }).
			map(response => response.json()).
			subscribe((result) => {
				this.dataStore.items.forEach((item, index) => {
					if (item.id === result.id) { this.dataStore.items[index] = result; }
				});
				this.dataStore.items.sort(this.sortByName);
				this._items.next(Object.assign({}, this.dataStore).items);
				this.toastr.info("Item is successfully saved.", this.serviceName);
				// If the update request came from another source, then it is an ad-hoc save of a non-current stream.
				// This shouldn't change the state of the current item.
				if (shouldUpdate) { this.curItemClean = true; }
			}, error => {
				this.toastr.error("Failed to save the item.", this.serviceName);
				console.log(error);
			});
	};
	delete(id: number, name?: string) {
		const verificationQuestion = this.serviceName + ": Are you sure you want to delete " + (name !== undefined ? name : "the item") + "?";
		if (confirm(verificationQuestion)) {
			this.authHttp.delete(this.baseUrl + "/" + id).subscribe(response => {
				this.dataStore.items.forEach((item, index) => {
					if (item.id === id) { this.dataStore.items.splice(index, 1); }
				});
				this.dataStore.items.sort(this.sortByName);
				this._items.next(Object.assign({}, this.dataStore).items);
				this.toastr.info("Item is deleted.", this.serviceName);
				this.router.navigate(["/dime/processes/process-list"]);
				this.resetCurItem();
			}, (error) => {
				this.toastr.error("Failed to delete item.", this.serviceName);
				console.log(error);
			});
		} else {
			this.toastr.info("Item deletion is cancelled.", this.serviceName);
		}
	};
	private resetCurItem = () => {
		this.curItem = { id: 0, name: "-" };
		this.curItemSteps = undefined;
		this.curItemClean = true;
		this.curItemIsReady = false;
	};
	private sortByName = (e1, e2) => {
		if (e1.name > e2.name) {
			return 1;
		} else if (e1.name < e2.name) {
			return -1;
		} else {
			return 0;
		}
	};
	public isReady = (id?: number) => {
		if (!id) { id = this.curItem.id; }
		this.toastr.warning("is Ready function should be implemented", this.serviceName);
		this.curItemIsReady = false;
	}
}
