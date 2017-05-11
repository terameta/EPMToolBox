import { Headers, Http, Response } from "@angular/http";
import { Injectable } from "@angular/core";
import "rxjs/Rx";
import { Observable } from "rxjs/Observable";
import { AuthHttp } from "angular2-jwt";

@Injectable()
export class DimeStreamService {

	constructor(private http: Http, private authHttp: AuthHttp) { }

	getAll() {
		return this.authHttp.get("/api/stream").map(
			(response: Response) => {
				const data = response.json();
				return data;
			}
		).catch(
			(error: Response) => {
				console.log(error);
				return Observable.throw("Fetching streams has failed");
			}
			)
	}

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

	listTypes() {
		return this.authHttp.get("/api/stream/listTypes").map((response: Response) => {
			const data = response.json();
			return data;
		}).catch((error: Response) => {
			console.log(error);
			return Observable.throw("Fetching environment type list has failed");
		});
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
	/*








		delete(id: number) {
			return this.authHttp.delete("/api/environment/" + id).map(
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



		verify(environmentID: number) {
			return this.authHttp.get("/api/environment/verify/" + environmentID).map( (response: Response) => {
				return response.json();
			}).catch((error: Response) => {
				console.log(error);
				return Observable.throw("Environment verification has failed");
			});
		}
	*/
}
