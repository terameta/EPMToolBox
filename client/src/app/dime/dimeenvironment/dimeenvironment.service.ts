import { Headers, Http, Response } from "@angular/http";
import { Injectable } from "@angular/core";
import "rxjs/Rx";
import { Observable } from "rxjs/Observable";
import { AuthHttp } from "angular2-jwt";

@Injectable()
export class DimeEnvironmentService {

	constructor(private http: Http, private authHttp: AuthHttp) { }

	getAll() {
		return this.authHttp.get("/api/environment").map(
			(response: Response) => {
				const data = response.json();
				return data;
			}
		).catch(
			(error: Response) => {
				return Observable.throw("Fetching Environments has failed");
			}
			)
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

	getOne(id: Number) {
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
		console.log("Service Updater", toSend);
		return this.authHttp.put("/api/environment/" + theEnvironment.id, toSend).map((response: Response) => {
			console.log("Resulted", theEnvironment);
			return response.json();
		}).catch((error: Response) => {
			console.log(error);
			console.log("Erred", theEnvironment);
			return Observable.throw("Updating the environment has failed:" + theEnvironment.name);
		});
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
}
