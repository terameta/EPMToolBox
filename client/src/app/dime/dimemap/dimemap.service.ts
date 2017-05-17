import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";

import { BehaviorSubject, Observable } from "rxjs/Rx";
import { AuthHttp } from "angular2-jwt";

import { DimeMap } from "../../../../../shared/model/map";

@Injectable()
export class DimeMapService {
	maps: Observable<DimeMap[]>;
	private _maps: BehaviorSubject<DimeMap[]>;
	private baseUrl: string;
	private dataStore: {
		maps: DimeMap[]
	};
	private headers = new Headers({ "Content-Type": "application/json" });

	constructor(private http: Http, private authHttp: AuthHttp) {
		console.log("We are at the dime map service");
		this.baseUrl = "/api/dime";
		this.dataStore = { maps: [] };
		this._maps = <BehaviorSubject<DimeMap[]>>new BehaviorSubject([]);
		this.maps = this._maps.asObservable();
	}

	getAll = () => {
		this.authHttp.get(this.baseUrl + "/map").
			map((response) => {
				return response.json();
			}).
			subscribe((data) => {
				this.dataStore.maps = data;
				this._maps.next(Object.assign({}, this.dataStore).maps);
			}, (error) => {
				console.log("Could not load maps.");
			});
	}

	getOne = (id: number) => {
		this.authHttp.get(this.baseUrl + "/map/" + id).map(response => response.json()).subscribe(data => {
			let notFound = true;

			this.dataStore.maps.forEach((item, index) => {
				if (item.id === data.id) {
					this.dataStore.maps[index] = data;
					notFound = false;
				}
			});

			if (notFound) {
				this.dataStore.maps.push(data);
			}

			this._maps.next(Object.assign({}, this.dataStore).maps);
		}, error => console.log("Could not load map."));
	}

	create = (dimeMap: DimeMap) => {
		this.authHttp.post(this.baseUrl + "/map", dimeMap, { headers: this.headers })
			.map(response => response.json()).subscribe(data => {
				this.dataStore.maps.push(data);
				this._maps.next(Object.assign({}, this.dataStore).maps);
			}, error => console.log("Could not create map."));
	}

	update = (dimeMap: DimeMap) => {
		this.authHttp.put(this.baseUrl + "/map/" + dimeMap.id, dimeMap, { headers: this.headers })
			.map(response => response.json()).subscribe(data => {
				this.dataStore.maps.forEach((item, index) => {
					if (item.id === data.id) { this.dataStore.maps[index] = data; }
				});

				this._maps.next(Object.assign({}, this.dataStore).maps);
			}, error => console.log("Could not update map."));
	}

	delete(id: number) {
		this.authHttp.delete(this.baseUrl + "/map/" + id).subscribe(response => {
			this.dataStore.maps.forEach((item, index) => {
				if (item.id === id) { this.dataStore.maps.splice(index, 1); }
			});

			this._maps.next(Object.assign({}, this.dataStore).maps);
		}, error => console.log("Could not delete map."));
	}
}
