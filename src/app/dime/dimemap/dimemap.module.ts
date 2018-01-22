import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

// import { HotTableModule } from 'ng2-handsontable';


import { AuthModule } from '../../welcome/auth.module';

import { DimeMapService } from './dimemap.service';
import { DimemapsComponent } from './dimemaps/dimemaps.component';
import { DimemapToolbarComponent } from './dimemap-toolbar/dimemap-toolbar.component';
import { DimemapListComponent } from './dimemap-list/dimemap-list.component';
import { DimemapDetailComponent } from './dimemap-detail/dimemap-detail.component';
import { DimemapComponent } from './dimemap/dimemap.component';
import { DimemapDetailTabMaindefinitionsComponent } from './dimemap-detail/dimemap-detail-tab-maindefinitions/dimemap-detail-tab-maindefinitions.component';
import { DimemapDetailTabMaptableComponent } from './dimemap-detail/dimemap-detail-tab-maptable/dimemap-detail-tab-maptable.component';
import { DimemapDetailTabSourcedefinitionsComponent } from './dimemap-detail/dimemap-detail-tab-sourcedefinitions/dimemap-detail-tab-sourcedefinitions.component';
import { DimemapDetailTabTargetdefinitionsComponent } from './dimemap-detail/dimemap-detail-tab-targetdefinitions/dimemap-detail-tab-targetdefinitions.component';
import { DimemapDetailTabImportexportComponent } from './dimemap-detail/dimemap-detail-tab-importexport/dimemap-detail-tab-importexport.component';

const dimeMapRoutes: Routes = [
	{ path: 'dime/maps', pathMatch: 'prefix', redirectTo: 'dime/maps/map-list' },
	{ path: 'map-list', component: DimemapListComponent },
	{
		path: 'map-detail/:id', component: DimemapDetailComponent, children: [
			{ path: '', pathMatch: 'prefix', redirectTo: 'maindefinitions' },
			{ path: 'maindefinitions', component: DimemapDetailTabMaindefinitionsComponent },
			{ path: 'maptable', component: DimemapDetailTabMaptableComponent },
			{ path: 'sourcedefinitions', component: DimemapDetailTabSourcedefinitionsComponent },
			{ path: 'targetdefinitions', component: DimemapDetailTabTargetdefinitionsComponent },
			{ path: 'importexport', component: DimemapDetailTabImportexportComponent }
		]
	}
];

@NgModule( {
	imports: [
		CommonModule,
		FormsModule,
		RouterModule.forChild( dimeMapRoutes ),
		AuthModule,
		// HotTableModule
	],
	exports: [
		RouterModule
	],
	providers: [
	],
	declarations: [
		DimemapsComponent,
		DimemapToolbarComponent,
		DimemapListComponent,
		DimemapDetailComponent,
		DimemapComponent,
		DimemapDetailTabMaindefinitionsComponent,
		DimemapDetailTabMaptableComponent,
		DimemapDetailTabSourcedefinitionsComponent,
		DimemapDetailTabTargetdefinitionsComponent,
		DimemapDetailTabImportexportComponent
	]
} )
export class DimemapModule { }
