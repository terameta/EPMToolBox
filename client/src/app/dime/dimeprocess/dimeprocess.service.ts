import { Headers, Http, Response } from "@angular/http";
import { Injectable } from "@angular/core";
import "rxjs/Rx";
import { Observable } from "rxjs/Observable";
import { AuthHttp } from "angular2-jwt";

@Injectable()
export class DimeProcessService {

	constructor(private http: Http, private authHttp: AuthHttp) { }
	getAll() {
		// const headers = new Headers({"Content-Type": "application/json"});

		// return this.authHttp.get("/api/process", {headers: headers}).map(
		return this.authHttp.get("/api/process").map(
			(response: Response) => {
				const data = response.json();
				return data;
			}
		).catch(
			(error: Response) => {
				return Observable.throw("Fetching Processes has failed");
			}
		);
	}
}
