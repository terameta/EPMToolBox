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
import { CentralModule } from '../../central/central.module';

const dimeEnvironmentRoutes: Routes = [
	{
		path: '', component: DimeenvironmentsComponent, children: [
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
		AuthModule,
		CentralModule
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
