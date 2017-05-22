import { Component, OnInit } from "@angular/core";

import { DimeMapService } from "../../dimemap.service";

@Component({
	selector: "app-dimemap-detail-tab-targetdefinitions",
	templateUrl: "./dimemap-detail-tab-targetdefinitions.component.html",
	styleUrls: ["./dimemap-detail-tab-targetdefinitions.component.css"]
})
export class DimemapDetailTabTargetdefinitionsComponent implements OnInit {

	constructor(private mainService: DimeMapService) { }

	ngOnInit() {
	}

}
