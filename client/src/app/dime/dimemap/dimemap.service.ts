import { ActivatedRoute, Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";

import { BehaviorSubject, Observable } from "rxjs/Rx";
import { AuthHttp } from "angular2-jwt";
import { ToastrService } from "ngx-toastr";

import { DimeMap } from "../../../../../shared/model/map";

@Injectable()
export class DimeMapService {
	items: Observable<DimeMap[]>;
	itemCount: Observable<number>;
	curItem: DimeMap;
	curItemClean: boolean;
	private serviceName: string;
	private _items: BehaviorSubject<DimeMap[]>;
	private baseUrl: string;
	private dataStore: {
		items: DimeMap[]
	};
	private headers = new Headers({ "Content-Type": "application/json" });

	constructor(
		private http: Http,
		private authHttp: AuthHttp,
		private toastr: ToastrService,
		private router: Router,
		private route: ActivatedRoute
	) {
		this.baseUrl = "/api/dime/map";
		this.dataStore = { items: [] };
		this._items = <BehaviorSubject<DimeMap[]>>new BehaviorSubject([]);
		this.items = this._items.asObservable();
		this.itemCount = this.items.count();
		this.serviceName = "Maps";
		this.resetCurItem();
	}

	getAll = () => {
		this.authHttp.get(this.baseUrl).
			map((response) => {
				return response.json();
			}).
			subscribe((data) => {
				this.dataStore.items = data;
				this._items.next(Object.assign({}, this.dataStore).items);
			}, (error) => {
				console.log("Could not load maps.");
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

				this._items.next(Object.assign({}, this.dataStore).items);
				this.curItem = result;
				this.curItemClean = true;
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
				this._items.next(Object.assign({}, this.dataStore).items);
				this.resetCurItem();
				this.router.navigate(["/dime/maps/map-detail", result.id]);
				this.toastr.info("New item is created, navigating to the details", this.serviceName);
			}, (error) => {
				this.toastr.error("Failed to create new item.", this.serviceName);
				console.log(error);
			}
			);
	}
	update = (dimeMap: DimeMap) => {
		this.authHttp.put(this.baseUrl + "/" + dimeMap.id, dimeMap, { headers: this.headers })
			.map(response => response.json()).subscribe(data => {
				this.dataStore.items.forEach((item, index) => {
					if (item.id === data.id) { this.dataStore.items[index] = data; }
				});

				this._items.next(Object.assign({}, this.dataStore).items);
			}, error => console.log("Could not update map."));
	}
	delete(id: number) {
		const verificationQuestion = this.serviceName + ": Are you sure you want to delete " + (name !== undefined ? name : "the item") + "?";
		if (confirm(verificationQuestion)) {
			this.authHttp.delete(this.baseUrl + "/" + id).subscribe(response => {
				this.dataStore.items.forEach((item, index) => {
					if (item.id === id) { this.dataStore.items.splice(index, 1); }
				});

				this._items.next(Object.assign({}, this.dataStore).items);
				this.toastr.info("Item is deleted.", this.serviceName);
				this.router.navigate(["/dime/maps/map-list"]);
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
		this.curItem = { id: 0, name: "-" };
		this.curItemClean = true;
	}
}
