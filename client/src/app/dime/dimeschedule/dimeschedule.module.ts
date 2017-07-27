import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { DimeschedulesComponent } from './dimeschedules/dimeschedules.component';
import { DimescheduleListComponent } from './dimeschedule-list/dimeschedule-list.component';
import { DimescheduleComponent } from './dimeschedule/dimeschedule.component';
import { DimescheduleDetailComponent } from './dimeschedule-detail/dimeschedule-detail.component';
import { DimescheduleToolbarComponent } from './dimeschedule-toolbar/dimeschedule-toolbar.component';

const dimeScheduleRoutes: Routes = [
	{ path: 'dime/schedules', pathMatch: 'prefix', redirectTo: 'dime/schedules/schedule-list' },
	{ path: 'schedule-list', component: DimescheduleListComponent },
	{ path: 'schedule-detail', component: DimescheduleDetailComponent }
];

@NgModule( {
	imports: [
		CommonModule,
		FormsModule,
		RouterModule.forChild( dimeScheduleRoutes )
	],
	exports: [
		RouterModule
	],
	declarations: [
		DimeschedulesComponent,
		DimescheduleListComponent,
		DimescheduleComponent,
		DimescheduleDetailComponent,
		DimescheduleToolbarComponent
	]
} )
export class DimescheduleModule { }
