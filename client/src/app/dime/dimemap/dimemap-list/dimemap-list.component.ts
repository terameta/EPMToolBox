import { DimeMap } from "../../../../../../shared/model/map";
import { Observable } from "rxjs/Rx";
import { DimeMapService } from "../dimemap.service";
import { Component, OnInit } from "@angular/core";

@Component({
	selector: "app-dimemap-list",
	templateUrl: "./dimemap-list.component.html",
	styleUrls: ["./dimemap-list.component.css"]
})
export class DimemapListComponent implements OnInit {
	maps: Observable<DimeMap[]>;

	constructor(private mapService: DimeMapService) {
		this.maps = this.mapService.maps;
	}

	ngOnInit() {
	}

}
