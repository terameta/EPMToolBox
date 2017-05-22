import { Component, OnInit } from "@angular/core";

import { DimeMapService } from "../dimemap.service";

@Component({
	selector: "app-dimemap-list",
	templateUrl: "./dimemap-list.component.html",
	styleUrls: ["./dimemap-list.component.css"]
})
export class DimemapListComponent implements OnInit {

	constructor(private mainService: DimeMapService) { }

	ngOnInit() {
	}
}
