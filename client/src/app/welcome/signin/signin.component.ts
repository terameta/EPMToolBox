import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
	selector: 'app-signin',
	templateUrl: './signin.component.html',
	styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

	constructor() { }

	ngOnInit() {
	}

	signIn(form: NgForm) {
		const email = form.value.email;
		const password = form.value.password;
	}

}
