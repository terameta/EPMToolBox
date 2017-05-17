import { Observable } from "rxjs/Rx";
import { Component, OnInit } from "@angular/core";

import { DimeMapService } from "../dimemap.service";

import { DimeMap } from "../../../../../../shared/model/map";

@Component({
	selector: "app-dimemap-toolbar",
	templateUrl: "./dimemap-toolbar.component.html",
	styleUrls: ["./dimemap-toolbar.component.css"]
})
export class DimemapToolbarComponent implements OnInit {
	maps: Observable<DimeMap[]>;
	currentMap: Observable<DimeMap>;

	constructor(private mapService: DimeMapService) { }

	ngOnInit() {
		this.maps = this.mapService.maps;
		this.mapService.getAll();
	}

	private create = () => {
		this.mapService.create({ id: 0, name: "New Map" });
	}

}
