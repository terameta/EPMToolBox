import { Http, Headers, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable'
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {

	constructor(private http: Http) { }

	signinUser(email: string, password: string) {
		const headers = new Headers({ 'Content-Type': 'application/json' });

		return this.http.post('/api/auth/signin', { email: email, password: password }, { headers: headers }).map(
			(response: Response) => {
				const data = response.json();
				return data;
			}
		).catch(
			(error: Response) => {
				console.log(error);
				return Observable.throw('Fetching Processes has failed');
			}
			);
	}

	loggedIn() {
		return tokenNotExpired();
	}

	getToken() {
		return
	}

}
