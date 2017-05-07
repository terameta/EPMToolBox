import { ToastrService } from "ngx-toastr";
import { DimeProcessService } from "../dimeprocess.service";
import { Component, OnInit } from "@angular/core";
import { Response } from "@angular/http";

@Component({
	selector: "app-dimeprocesses",
	templateUrl: "./dimeprocesses.component.html",
	styleUrls: ["./dimeprocesses.component.css"]
})
export class DimeprocessesComponent implements OnInit {

	processes: any[] = [];


	constructor(
		private dimeProcessService: DimeProcessService,
		private toastrService: ToastrService
	) { }

	ngOnInit() {
		// console.log("This is not doSomething");
		// this.doSomething();
	}

	onGet() {
		this.dimeProcessService.getAll().subscribe(
			(srcprocesses: any[]) => {
				this.processes = srcprocesses;
			},
			(error) => {
				this.toastrService.error(error);
			}
		);
	}

	// doSomething(): void {
	// 	console.log("Do Something");
	// }
}
