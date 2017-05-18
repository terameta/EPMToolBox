import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { ToastrService } from "ngx-toastr";

import { DimeStreamService } from "../dimestream.service";


@Component({
	selector: "app-dimestream-toolbar",
	templateUrl: "./dimestream-toolbar.component.html",
	styleUrls: ["./dimestream-toolbar.component.css"]
})
export class DimestreamToolbarComponent implements OnInit {
	// streamList: any[];

	constructor(
		private mainService: DimeStreamService,
		private toastr: ToastrService,
		private router: Router
	) { }

	ngOnInit() {
	}
}
