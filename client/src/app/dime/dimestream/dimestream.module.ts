import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DimestreamListComponent } from './dimestream-list/dimestream-list.component';
import { DimestreamDetailComponent } from './dimestream-detail/dimestream-detail.component';
import { DimestreamComponent } from './dimestream/dimestream.component';
import { AuthModule } from '../../welcome/auth.module';
// import { AuthModule } from 'app/welcome/auth.module';
// import { DimeStreamService } from "./dimestream.service";
import { DimestreamsComponent } from './dimestreams/dimestreams.component';
import { DimestreamToolbarComponent } from './dimestream-toolbar/dimestream-toolbar.component';

import { DescribedFieldFilter } from './dimestream.describedfield.pipe';

const dimeStreamRoutes: Routes = [
	{ path: 'dime/streams', pathMatch: 'prefix', redirectTo: 'dime/streams/stream-list' },
	{ path: 'stream-list', component: DimestreamListComponent },
	{ path: 'stream-detail/:id', component: DimestreamDetailComponent }
]

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		RouterModule.forChild(dimeStreamRoutes),
		AuthModule
	],
	exports: [
		RouterModule
	],
	providers: [
		// DimeStreamService
	],
	declarations: [
		DimestreamToolbarComponent,
		DimestreamListComponent,
		DimestreamDetailComponent,
		DimestreamComponent,
		DimestreamsComponent,
		DescribedFieldFilter
	]
})
export class DimestreamModule { }
