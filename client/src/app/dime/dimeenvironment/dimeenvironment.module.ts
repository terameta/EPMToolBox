import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { DimeenvironmentListComponent } from "./dimeenvironment-list/dimeenvironment-list.component";
import { DimeenvironmentDetailComponent } from "./dimeenvironment-detail/dimeenvironment-detail.component";
import { DimeenvironmentComponent } from "./dimeenvironment/dimeenvironment.component";
import { AuthModule } from "app/welcome/auth.module";
import { DimeEnvironmentService } from "./dimeenvironment.service";
import { DimeenvironmentsComponent } from "./dimeenvironments/dimeenvironments.component";
import { DimeenvironmentToolbarComponent } from "./dimeenvironment-toolbar/dimeenvironment-toolbar.component";

const dimeEnvironmentRoutes: Routes = [
	{ path: "dime/environments", pathMatch: "prefix", redirectTo: "dime/environments/environment-list" },
	{ path: "environment-list", component: DimeenvironmentListComponent },
	{ path: "environment-detail", component: DimeenvironmentDetailComponent }
]

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(dimeEnvironmentRoutes),
		AuthModule
	],
	exports: [
		RouterModule
	],
	providers: [
		DimeEnvironmentService
	],
	declarations: [
		DimeenvironmentListComponent,
		DimeenvironmentDetailComponent,
		DimeenvironmentComponent,
		DimeenvironmentsComponent,
		DimeenvironmentToolbarComponent
	]
})
export class DimeenvironmentModule { }
