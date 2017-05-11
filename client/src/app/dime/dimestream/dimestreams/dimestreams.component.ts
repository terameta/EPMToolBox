import { Component, OnInit } from "@angular/core";

import { ToastrService } from "ngx-toastr";

import { DimeStreamService } from "../dimestream.service";


@Component({
	selector: "app-dimestreams",
	templateUrl: "./dimestreams.component.html",
	styleUrls: ["./dimestreams.component.css"]
})
export class DimestreamsComponent implements OnInit {

	constructor(
		private DimeStreamService: DimeStreamService,
		private toastrService: ToastrService
	) { }

	ngOnInit() {
	}

}
