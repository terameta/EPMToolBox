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
	streamList: any[];

	constructor(
		private streamService: DimeStreamService,
		private toastr: ToastrService,
		private router: Router
	) { }

	ngOnInit() {
		this.getAll();
	}

	getAll() {
		this.streamService.getAll().subscribe(
			(streamList: any[]) => {
				this.streamList = streamList;
			}, (error) => {
				this.toastr.error(error);
			}
		)
	}

	create() {
		this.streamService.create().subscribe(
			(result: any) => {
				this.router.navigate(["/dime/streams/stream-detail", result.id]);
				this.toastr.info("New stream is created, navigating to the details");
			}, (error) => {
				this.toastr.error(error);
			}
		)
	}
}
