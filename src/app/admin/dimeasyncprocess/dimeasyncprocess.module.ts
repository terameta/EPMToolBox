import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DimeAsyncProcessesComponent } from './dimeasyncprocesses/dimeasyncprocesses.component';
import { DimeAsyncProcessToolbarComponent } from './dimeasyncprocess-toolbar/dimeasyncprocess-toolbar.component';
import { DimeAsyncProcessListComponent } from './dimeasyncprocess-list/dimeasyncprocess-list.component';
import { DimeAsyncProcessDetailComponent } from './dimeasyncprocess-detail/dimeasyncprocess-detail.component';
import { DimeAsyncProcessComponent } from './dimeasyncprocess/dimeasyncprocess.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthModule } from '../../auth/auth.module';

const dimeAsyncProcessRoutes: Routes = [
	{
		path: '', component: DimeAsyncProcessesComponent, children: [
			{ path: '', pathMatch: 'full', redirectTo: 'asyncprocess-list' },
			{ path: 'asyncprocess-list', component: DimeAsyncProcessListComponent },
			{ path: 'asyncprocess-detail/:id', component: DimeAsyncProcessDetailComponent }
		]
	}
];

@NgModule( {
	imports: [
		CommonModule,
		FormsModule,
		RouterModule.forChild( dimeAsyncProcessRoutes ),
		AuthModule
	],
	exports: [
		RouterModule
	],
	declarations: [
		DimeAsyncProcessesComponent,
		DimeAsyncProcessToolbarComponent,
		DimeAsyncProcessListComponent,
		DimeAsyncProcessDetailComponent,
		DimeAsyncProcessComponent
	]
} )
export class DimeAsyncProcessModule { }
