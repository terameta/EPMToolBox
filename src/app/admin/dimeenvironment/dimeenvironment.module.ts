import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { AuthModule } from '../../auth/auth.module';

import { DimeenvironmentListComponent } from './dimeenvironment-list/dimeenvironment-list.component';
import { DimeenvironmentDetailComponent } from './dimeenvironment-detail/dimeenvironment-detail.component';
import { DimeenvironmentComponent } from './dimeenvironment/dimeenvironment.component';
import { DimeenvironmentsComponent } from './dimeenvironments/dimeenvironments.component';
import { DimeenvironmentToolbarComponent } from './dimeenvironment-toolbar/dimeenvironment-toolbar.component';

const dimeEnvironmentRoutes: Routes = [
	{
		path: '', component: DimeenvironmentsComponent, children: [
			// { path: '', pathMatch: 'full', redirectTo: 'environment-list' },
			// { path: 'environment-list', component: DimeenvironmentListComponent },
			// { path: 'environment-detail/:id', component: DimeenvironmentDetailComponent }
			{ path: '', component: DimeenvironmentListComponent },
			{ path: ':id', component: DimeenvironmentDetailComponent }
		]
	}

];

@NgModule( {
	imports: [
		CommonModule,
		FormsModule,
		RouterModule.forChild( dimeEnvironmentRoutes ),
		AuthModule
	],
	exports: [
		RouterModule
	],
	providers: [
		// DimeEnvironmentService
	],
	declarations: [
		DimeenvironmentListComponent,
		DimeenvironmentDetailComponent,
		DimeenvironmentComponent,
		DimeenvironmentsComponent,
		DimeenvironmentToolbarComponent
	]
} )
export class DimeEnvironmentModule { }
