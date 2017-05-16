import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DimeMapService } from "./dimemap.service";
import { DimemapsComponent } from "./dimemaps/dimemaps.component";
import { DimemapToolbarComponent } from "./dimemap-toolbar/dimemap-toolbar.component";
import { DimemapListComponent } from "./dimemap-list/dimemap-list.component";
import { DimemapDetailComponent } from "./dimemap-detail/dimemap-detail.component";
import { DimemapComponent } from "./dimemap/dimemap.component";

@NgModule({
	imports: [
		CommonModule
	],
	providers: [
		DimeMapService
	],
	declarations: [DimemapsComponent, DimemapToolbarComponent, DimemapListComponent, DimemapDetailComponent, DimemapComponent]
})
export class DimemapModule { }
