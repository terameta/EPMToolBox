import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";

import { AuthModule } from "../../welcome/auth.module";

import { DimeMapService } from "./dimemap.service";
import { DimemapsComponent } from "./dimemaps/dimemaps.component";
import { DimemapToolbarComponent } from "./dimemap-toolbar/dimemap-toolbar.component";
import { DimemapListComponent } from "./dimemap-list/dimemap-list.component";
import { DimemapDetailComponent } from "./dimemap-detail/dimemap-detail.component";
import { DimemapComponent } from "./dimemap/dimemap.component";

const dimeMapRoutes: Routes = [
	{ path: "dime/maps", pathMatch: "prefix", redirectTo: "dime/maps/map-list" },
	{ path: "map-list", component: DimemapListComponent },
	{ path: "map-detail/:id", component: DimemapDetailComponent }
]

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		RouterModule.forChild(dimeMapRoutes),
		AuthModule
	],
	exports: [
		RouterModule
	],
	providers: [
		// DimeMapService
	],
	declarations: [
		DimemapsComponent,
		DimemapToolbarComponent,
		DimemapListComponent,
		DimemapDetailComponent,
		DimemapComponent
	]
})
export class DimemapModule { }
