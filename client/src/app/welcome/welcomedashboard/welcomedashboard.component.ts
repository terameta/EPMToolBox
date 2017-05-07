import { Component, OnInit } from "@angular/core";

import { AuthService } from "../auth.service";

@Component({
	selector: "app-welcomedashboard",
	templateUrl: "./welcomedashboard.component.html",
	styleUrls: ["./welcomedashboard.component.css"]
})
export class WelcomedashboardComponent implements OnInit {

	constructor(private authService: AuthService) { }

	ngOnInit() {
	}

}
