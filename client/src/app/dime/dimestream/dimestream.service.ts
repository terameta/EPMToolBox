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
}
