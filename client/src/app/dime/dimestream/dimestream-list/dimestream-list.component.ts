import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";

import { ToastrService } from "ngx-toastr";

import { DimeStreamService } from "../dimestream.service";

@Component({
	selector: "app-dimestream-list",
	templateUrl: "./dimestream-list.component.html",
	styleUrls: ["./dimestream-list.component.css"]
})
export class DimestreamListComponent implements OnInit {

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
				console.log(error);
				this.toastr.error(error);
			}
		)
	}
/*


	streamDelete(envID) {
		this.dimeStreamService.delete(envID).subscribe(
			(result) => {
				this.toastr.info("Stream is now deleted. We are now going back to the stream list.");
				this.getAll();
			}, (error) => {
				this.toastr.error(error);
			}
		);
	}
*/
}
