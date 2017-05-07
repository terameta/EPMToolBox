import { AuthModule } from "../welcome/auth.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule, CanActivate } from "@angular/router";

import { AuthGuard } from "../welcome/auth-guard.service";

import { DimeComponent } from "./dime/dime.component";
import { DimemenuComponent } from "./dimemenu/dimemenu.component";

import { DimeprocessesComponent } from "app/dime/dimeprocess/dimeprocesses/dimeprocesses.component";
import { DimeschedulesComponent } from "app/dime/dimeschedule/dimeschedules/dimeschedules.component";
import { DimeenvironmentsComponent } from "app/dime/dimeenvironment/dimeenvironments/dimeenvironments.component";

import { DimescheduleModule } from "app/dime/dimeschedule/dimeschedule.module";
import { DimeprocessModule } from "app/dime/dimeprocess/dimeprocess.module";
import { DimeenvironmentModule } from "app/dime/dimeenvironment/dimeenvironment.module";

import { DimedashboardComponent } from "./dimedashboard/dimedashboard.component";





const dimeRoutes: Routes = [
	{
		path: "dime", component: DimeComponent, children: [
			{ path: "", component: DimedashboardComponent, canActivate: [AuthGuard] },
			{ path: "schedules", component: DimeschedulesComponent, loadChildren: "app/dime/dimeschedule/dimeschedule.module#DimescheduleModule" },
			{ path: "processes", component: DimeprocessesComponent, loadChildren: "app/dime/dimeprocess/dimeprocess.module#DimeprocessModule" },
			// tslint:disable-next-line:max-line-length
			{ path: "environments", component: DimeenvironmentsComponent, loadChildren: "app/dime/dimeenvironment/dimeenvironment.module#DimeenvironmentModule" }
		]
	}
];

@NgModule({
	imports: [
		CommonModule,
		DimeprocessModule,
		DimescheduleModule,
		DimeenvironmentModule,
		RouterModule.forChild(dimeRoutes),
		AuthModule
	],
	exports: [
		RouterModule
	],
	declarations: [DimeComponent, DimemenuComponent, DimedashboardComponent]
})
export class DimeModule { }
