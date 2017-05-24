import { AuthModule } from '../../welcome/auth.module';
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


const dimeProcessRoutes: Routes = [
	{ path: 'dime/processes', pathMatch: 'prefix', redirectTo: 'dime/processes/process-list' },
	{ path: 'process-list', component: DimeprocessListComponent },
	{ path: 'process-detail/:id', component: DimeprocessDetailComponent },
	{ path: 'process-step-detail/:id', component: DimeprocessStepDetailComponent }
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		RouterModule.forChild(dimeProcessRoutes),
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
		DimeprocessStepDetailComponent
	]
})
export class DimeprocessModule { }
