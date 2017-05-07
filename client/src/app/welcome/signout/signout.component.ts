import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";

import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
	selector: "app-signout",
	templateUrl: "./signout.component.html",
	styleUrls: ["./signout.component.css"]
})
export class SignoutComponent implements OnInit {

	constructor(
		private authService: AuthService,
		private router: Router,
		private toastrService: ToastrService) { }

	ngOnInit() {
		this.authService.logout();
		this.toastrService.success("You have successfully signed out.");
	}
}
