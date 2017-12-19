import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DimeStreamListComponent } from './dimestream-list/dimestream-list.component';
import { DimeStreamDetailComponent } from './dimestream-detail/dimestream-detail.component';
import { DimeStreamComponent } from './dimestream/dimestream.component';
import { AuthModule } from '../../welcome/auth.module';
// import { AuthModule } from 'app/welcome/auth.module';
// import { DimeStreamService } from "./dimestream.service";
import { DimeStreamsComponent } from './dimestreams/dimestreams.component';
import { DimeStreamToolbarComponent } from './dimestream-toolbar/dimestream-toolbar.component';

import { DescribedFieldFilter } from './dimestream.describedfield.pipe';
import { DimeStreamDetailMainDefinitionsComponent } from './dimestream-detail/dime-stream-detail-main-definitions/dime-stream-detail-main-definitions.component';
import { DimeStreamDetailFieldsComponent } from './dimestream-detail/dime-stream-detail-fields/dime-stream-detail-fields.component';
import { DimeStreamDetailFieldDescriptionsComponent } from './dimestream-detail/dime-stream-detail-field-descriptions/dime-stream-detail-field-descriptions.component';

const dimeStreamRoutes: Routes = [
	{ path: 'dime/streams', pathMatch: 'prefix', redirectTo: 'dime/streams/stream-list' },
	{ path: 'stream-list', component: DimeStreamListComponent },
	{
		path: 'stream-detail/:id', component: DimeStreamDetailComponent, children: [
			{ path: '', pathMatch: 'prefix', redirectTo: 'definitions' },
			{ path: 'definitions', component: DimeStreamDetailMainDefinitionsComponent },
			{ path: 'fields', component: DimeStreamDetailFieldsComponent },
			{ path: 'fielddescriptions', component: DimeStreamDetailFieldDescriptionsComponent }
		]
	}
]

@NgModule( {
	imports: [
		CommonModule,
		FormsModule,
		RouterModule.forChild( dimeStreamRoutes ),
		AuthModule
	],
	exports: [
		RouterModule
	],
	providers: [
		// DimeStreamService
	],
	declarations: [
		DimeStreamToolbarComponent,
		DimeStreamListComponent,
		DimeStreamDetailComponent,
		DimeStreamComponent,
		DimeStreamsComponent,
		DescribedFieldFilter,
		DimeStreamDetailMainDefinitionsComponent,
		DimeStreamDetailFieldsComponent,
		DimeStreamDetailFieldDescriptionsComponent
	]
} )
export class DimestreamModule { }
