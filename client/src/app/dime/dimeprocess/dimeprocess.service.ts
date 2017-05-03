import { Headers, Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DimeProcessService {

	constructor(private http: Http) { }
	getAll() {
		const headers = new Headers({'Content-Type': 'application/json'});

		return this.http.get('/api/process', {headers: headers}).map(
			(response: Response) => {
				const data = response.json();
				return data;
			}
		).catch(
			(error: Response) => {
				return Observable.throw('Fetching Processes has failed');
			}
		);
	}
}
