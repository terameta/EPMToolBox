import { Component, OnInit } from "@angular/core";

import { DimeMapService } from "../../dimemap.service";
import { DimeStreamService } from "../../../dimestream/dimestream.service";

@Component({
	selector: "app-dimemap-detail-tab-sourcedefinitions",
	templateUrl: "./dimemap-detail-tab-sourcedefinitions.component.html",
	styleUrls: ["./dimemap-detail-tab-sourcedefinitions.component.css"]
})
export class DimemapDetailTabSourcedefinitionsComponent implements OnInit {

	constructor(
		private mainService: DimeMapService,
		private streamService: DimeStreamService
	) { }

	ngOnInit() {
	}

}
