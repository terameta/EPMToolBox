import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { DimeComponent } from './dime/dime.component';
import { DimemenuComponent } from './dimemenu/dimemenu.component';
import { DimeprocessesComponent } from 'app/dime/dimeprocess/dimeprocesses/dimeprocesses.component';
import { DimeschedulesComponent } from 'app/dime/dimeschedule/dimeschedules/dimeschedules.component';
import { DimescheduleModule } from 'app/dime/dimeschedule/dimeschedule.module';
import { DimeprocessModule } from 'app/dime/dimeprocess/dimeprocess.module';
import { DimedashboardComponent } from './dimedashboard/dimedashboard.component';


const dimeRoutes: Routes = [
	{ path: 'dime', component: DimeComponent, children: [
		{ path: '', component: DimedashboardComponent },
		{ path: 'schedules', component: DimeschedulesComponent, loadChildren: 'app/dime/dimeschedule/dimeschedule.module#DimescheduleModule' },
		{ path: 'processes', component: DimeprocessesComponent }
	] }
];

@NgModule({
	imports: [
		CommonModule,
		DimeprocessModule,
		DimescheduleModule,
		RouterModule.forChild(dimeRoutes)
	],
	exports: [
		RouterModule
	],
	declarations: [DimeComponent, DimemenuComponent, DimedashboardComponent]
})
export class DimeModule { }
