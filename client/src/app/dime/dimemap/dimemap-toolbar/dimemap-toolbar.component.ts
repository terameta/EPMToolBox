import { Observable } from "rxjs/Rx";
import { Component, OnInit } from "@angular/core";

import { DimeMapService } from "../dimemap.service";

// import { DimeMap } from "../../../../../../shared/model/dime/map";

@Component({
	selector: "app-dimemap-toolbar",
	templateUrl: "./dimemap-toolbar.component.html",
	styleUrls: ["./dimemap-toolbar.component.css"]
})
export class DimemapToolbarComponent implements OnInit {

	constructor(private mainService: DimeMapService) { }

	ngOnInit() {
		this.mainService.getAll();
	}
}
