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
	private _items: BehaviorSubject<DimeMap[]>;
	private baseUrl: string;
	private dataStore: {
		items: DimeMap[]
	};
	private headers = new Headers({ "Content-Type": "application/json" });

	constructor(private http: Http, private authHttp: AuthHttp, private toastr: ToastrService) {
		this.baseUrl = "/api/dime/map";
		this.dataStore = { items: [] };
		this._items = <BehaviorSubject<DimeMap[]>>new BehaviorSubject([]);
		this.items = this._items.asObservable();
		this.itemCount = this.items.count();
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
			}, error => console.log("Could not create map."));
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
		this.authHttp.delete(this.baseUrl + "/" + id).subscribe(response => {
			this.dataStore.items.forEach((item, index) => {
				if (item.id === id) { this.dataStore.items.splice(index, 1); }
			});

			this._items.next(Object.assign({}, this.dataStore).items);
		}, error => console.log("Could not delete map."));
	}
}
