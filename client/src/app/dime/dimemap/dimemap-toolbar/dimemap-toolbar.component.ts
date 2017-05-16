import { Component, OnInit } from "@angular/core";

@Component({
	selector: "app-dimemap-toolbar",
	templateUrl: "./dimemap-toolbar.component.html",
	styleUrls: ["./dimemap-toolbar.component.css"]
})
export class DimemapToolbarComponent implements OnInit {

	constructor() { }

	ngOnInit() {
	}

	private create = () => {
		console.log("We will be creating a new map");
	}

}
