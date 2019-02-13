import { AuthModule } from '../../auth/auth.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { DimeProcessService } from './dimeprocess.service';
import { DimeprocessListComponent } from './dimeprocess-list/dimeprocess-list.component';
import { DimeprocessDetailComponent } from './dimeprocess-detail/dimeprocess-detail.component';
import { DimeprocessesComponent } from './dimeprocesses/dimeprocesses.component';
import { DimeprocessToolbarComponent } from './dimeprocess-toolbar/dimeprocess-toolbar.component';
import { DimeprocessComponent } from './dimeprocess/dimeprocess.component';
import { DimeprocessDetailTabMaindefinitionsComponent } from './dimeprocess-detail/dimeprocess-detail-tab-maindefinitions/dimeprocess-detail-tab-maindefinitions.component';
import { DimeprocessDetailTabRunComponent } from './dimeprocess-detail/dimeprocess-detail-tab-run/dimeprocess-detail-tab-run.component';
import { DimeprocessDetailTabStepsComponent } from './dimeprocess-detail/dimeprocess-detail-tab-steps/dimeprocess-detail-tab-steps.component';
import { DimeprocessDetailTabDefaulttargetsComponent } from './dimeprocess-detail/dimeprocess-detail-tab-defaulttargets/dimeprocess-detail-tab-defaulttargets.component';
import { DimeprocessDetailTabFiltersComponent } from './dimeprocess-detail/dimeprocess-detail-tab-filters/dimeprocess-detail-tab-filters.component';
import { DimeprocessStepDetailComponent } from './dimeprocess-step-detail/dimeprocess-step-detail.component';

import { DimeProcessFilterPipe } from './dimeprocess.filter.pipe';
import { DimeprocessDetailTabFiltersdatafileComponent } from './dimeprocess-detail/dimeprocess-detail-tab-filtersdatafile/dimeprocess-detail-tab-filtersdatafile.component';
import { DimeprocessStepListComponent } from './dimeprocess-step-list/dimeprocess-step-list.component';
import { DimeprocessStepDetailSrcprocedureComponent } from './dimeprocess-step-detail-srcprocedure/dimeprocess-step-detail-srcprocedure.component';
import { DimeprocessStepDetailPulldataComponent } from './dimeprocess-step-detail-pulldata/dimeprocess-step-detail-pulldata.component';
import { DimeprocessStepDetailMapdataComponent } from './dimeprocess-step-detail-mapdata/dimeprocess-step-detail-mapdata.component';
import { DimeprocessStepDetailTransformComponent } from './dimeprocess-step-detail-transform/dimeprocess-step-detail-transform.component';
import { DimeprocessStepDetailValidateComponent } from './dimeprocess-step-detail-validate/dimeprocess-step-detail-validate.component';
import { DimeprocessStepDetailPushdataComponent } from './dimeprocess-step-detail-pushdata/dimeprocess-step-detail-pushdata.component';
import { DimeprocessStepDetailTarprocedureComponent } from './dimeprocess-step-detail-tarprocedure/dimeprocess-step-detail-tarprocedure.component';
import { DimeprocessStepDetailSenddataComponent } from './dimeprocess-step-detail-senddata/dimeprocess-step-detail-senddata.component';
import { DimeprocessStepDetailSendmissingComponent } from './dimeprocess-step-detail-sendmissing/dimeprocess-step-detail-sendmissing.component';
import { DimeprocessStepDetailSendlogsComponent } from './dimeprocess-step-detail-sendlogs/dimeprocess-step-detail-sendlogs.component';
import { DimeprocessDetailTabHistoryComponent } from './dimeprocess-detail/dimeprocess-detail-tab-history/dimeprocess-detail-tab-history.component';

const dimeProcessRoutes: Routes = [
	{
		path: '', component: DimeprocessesComponent, children: [
			{ path: '', pathMatch: 'full', redirectTo: 'process-list' },
			{ path: 'process-list', component: DimeprocessListComponent },
			{
				path: 'process-detail/:id', component: DimeprocessDetailComponent, children: [
					{ path: '', pathMatch: 'prefix', redirectTo: 'definitions' },
					{ path: 'definitions', component: DimeprocessDetailTabMaindefinitionsComponent },
					{ path: 'run', component: DimeprocessDetailTabRunComponent },
					{
						path: 'steps', component: DimeprocessDetailTabStepsComponent, children: [
							{ path: '', pathMatch: 'prefix', redirectTo: 'list' },
							{ path: 'list', component: DimeprocessStepListComponent },
							{ path: ':stepid', component: DimeprocessStepDetailComponent }
						]
					},
					{ path: 'defaulttargets', component: DimeprocessDetailTabDefaulttargetsComponent },
					{ path: 'filters', component: DimeprocessDetailTabFiltersComponent },
					{ path: 'filtersdatafile', component: DimeprocessDetailTabFiltersdatafileComponent },
					{ path: 'history', component: DimeprocessDetailTabHistoryComponent }
				]
			},
			{ path: 'process-step-detail/:id', component: DimeprocessStepDetailComponent }
		]
	},
];

@NgModule( {
	imports: [
		CommonModule,
		FormsModule,
		RouterModule.forChild( dimeProcessRoutes ),
		AuthModule
	],
	exports: [
		RouterModule
	],
	providers: [
	],
	declarations: [
		DimeprocessListComponent,
		DimeprocessDetailComponent,
		DimeprocessesComponent,
		DimeprocessToolbarComponent,
		DimeprocessComponent,
		DimeprocessDetailTabMaindefinitionsComponent,
		DimeprocessDetailTabRunComponent,
		DimeprocessDetailTabStepsComponent,
		DimeprocessDetailTabDefaulttargetsComponent,
		DimeprocessDetailTabFiltersComponent,
		DimeprocessStepDetailComponent,
		DimeProcessFilterPipe,
		DimeprocessDetailTabFiltersdatafileComponent,
		DimeprocessStepListComponent,
		DimeprocessStepDetailSrcprocedureComponent,
		DimeprocessStepDetailPulldataComponent,
		DimeprocessStepDetailMapdataComponent,
		DimeprocessStepDetailTransformComponent,
		DimeprocessStepDetailValidateComponent,
		DimeprocessStepDetailPushdataComponent,
		DimeprocessStepDetailTarprocedureComponent,
		DimeprocessStepDetailSenddataComponent,
		DimeprocessStepDetailSendmissingComponent,
		DimeprocessStepDetailSendlogsComponent,
		DimeprocessDetailTabHistoryComponent
	]
} )
export class DimeprocessModule { }
