import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";

import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
	selector: "app-signin",
	templateUrl: "./signin.component.html",
	styleUrls: ["./signin.component.css"]
})
export class SigninComponent implements OnInit {
	isSigningIn = false;

	constructor(
		private authService: AuthService,
		private router: Router,
		private toastrService: ToastrService
	) { }

	ngOnInit() {
		if (this.authService.authenticated) {
			console.log("We are actially logged in, so we should route");
			console.log(this.authService.jwtHelper.decodeToken(localStorage.getItem("token")));
			console.log(this.authService.jwtHelper.getTokenExpirationDate(localStorage.getItem("token")));
			console.log(this.authService.jwtHelper.isTokenExpired(localStorage.getItem("token")));
			this.router.navigate(["/"]);
		}
	}

	signIn(form: NgForm) {
		this.isSigningIn = true;
		const username = form.value.username;
		const password = form.value.password;
		// console.log("We are signing in");
		this.authService.signinUser(username, password).subscribe((result) => {
			// console.log("Resulted", result);
			this.router.navigate(["/"]);
			this.toastrService.success("You have successfully signed in");
			this.isSigningIn = false;
		}, (error) => {
			// console.log("Erred:", error);
			this.toastrService.error(error);
			this.isSigningIn = false;
		});
	}

}
