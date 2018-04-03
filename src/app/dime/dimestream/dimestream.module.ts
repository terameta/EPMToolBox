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
import { DimeStreamDetailFieldsHpdbComponent } from './dimestream-detail/dime-stream-detail-fields-hpdb/dime-stream-detail-fields-hpdb.component';
import { DimeStreamDetailFieldsRdbtComponent } from './dimestream-detail/dime-stream-detail-fields-rdbt/dime-stream-detail-fields-rdbt.component';
import { DimeStreamDetailFieldDescriptionsHpdbComponent } from './dimestream-detail/dime-stream-detail-field-descriptions-hpdb/dime-stream-detail-field-descriptions-hpdb.component';
import { DimeStreamDetailFieldDescriptionsRdbtComponent } from './dimestream-detail/dime-stream-detail-field-descriptions-rdbt/dime-stream-detail-field-descriptions-rdbt.component';
import { DimeStreamDetailFieldDescriptionsRouterComponent } from './dimestream-detail/dime-stream-detail-field-descriptions-router/dime-stream-detail-field-descriptions-router.component';
import { DimeStreamDetailExportComponent } from './dimestream-detail/dime-stream-detail-export/dime-stream-detail-export.component';
import { DimeStreamDetailExportRDBTComponent } from './dimestream-detail/dime-stream-detail-export-rdbt/dime-stream-detail-export-rdbt.component';
import { DimeStreamDetailExportHPDBComponent } from './dimestream-detail/dime-stream-detail-export-hpdb/dime-stream-detail-export-hpdb.component';
import { SharedModule } from '../../shared/shared.module';
import { DimeStreamDetailExportListComponent } from './dimestream-detail/dime-stream-detail-export-list/dime-stream-detail-export-list.component';
import { DimeStreamDetailExportDetailComponent } from './dimestream-detail/dime-stream-detail-export-detail/dime-stream-detail-export-detail.component';

const dimeStreamRoutes: Routes = [
	{ path: 'dime/streams', pathMatch: 'prefix', redirectTo: 'dime/streams/stream-list' },
	{ path: 'stream-list', component: DimeStreamListComponent },
	{
		path: 'stream-detail/:id', component: DimeStreamDetailComponent, children: [
			{ path: '', pathMatch: 'prefix', redirectTo: 'definitions' },
			{ path: 'definitions', component: DimeStreamDetailMainDefinitionsComponent },
			{ path: 'fields', component: DimeStreamDetailFieldsComponent },
			{
				path: 'fielddescriptions', component: DimeStreamDetailFieldDescriptionsRouterComponent, children: [
					{ path: '', component: DimeStreamDetailFieldDescriptionsComponent },
					{ path: ':fieldid', component: DimeStreamDetailFieldDescriptionsComponent }
				]
			},
			{
				path: 'export', component: DimeStreamDetailExportComponent, children: [
					{ path: '', pathMatch: 'prefix', redirectTo: 'list' },
					{ path: 'list', component: DimeStreamDetailExportListComponent },
					{ path: ':exportid', component: DimeStreamDetailExportDetailComponent }
				]
			}
		]
	}
];

@NgModule( {
	imports: [
		CommonModule,
		FormsModule,
		RouterModule.forChild( dimeStreamRoutes ),
		AuthModule,
		SharedModule
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
		DimeStreamDetailFieldDescriptionsComponent,
		DimeStreamDetailFieldsHpdbComponent,
		DimeStreamDetailFieldsRdbtComponent,
		DimeStreamDetailFieldDescriptionsHpdbComponent,
		DimeStreamDetailFieldDescriptionsRdbtComponent,
		DimeStreamDetailFieldDescriptionsRouterComponent,
		DimeStreamDetailExportComponent,
		DimeStreamDetailExportRDBTComponent,
		DimeStreamDetailExportHPDBComponent,
		DimeStreamDetailExportListComponent,
		DimeStreamDetailExportDetailComponent
	]
} )
export class DimestreamModule { }
