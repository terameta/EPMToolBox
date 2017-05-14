import { AuthService } from "./auth.service";
import { CanActivate, Router } from "@angular/router";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private auth: AuthService, private router: Router) { }

	canActivate() {
		// If the user is not logged in we'll send them back to the home page
		if (!this.auth.authenticated) {
			console.log("User is not authenticated");
			this.router.navigate(["/"]);
			return false;
		}
		return true;
	}
}
