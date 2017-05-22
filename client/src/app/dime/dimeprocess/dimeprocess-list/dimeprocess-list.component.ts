import { Component, OnInit } from "@angular/core";

import { DimeProcessService } from "../dimeprocess.service";

@Component({
	selector: "app-dimeprocess-list",
	templateUrl: "./dimeprocess-list.component.html",
	styleUrls: ["./dimeprocess-list.component.css"]
})
export class DimeprocessListComponent implements OnInit {

	constructor(private mainService: DimeProcessService) { }

	ngOnInit() {
	}
}
