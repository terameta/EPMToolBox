import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth-guard.service';

import { DimeComponent } from './dime/dime.component';
import { DimemenuComponent } from './dimemenu/dimemenu.component';
import { DimedashboardComponent } from './dimedashboard/dimedashboard.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

const routes: Routes = [
	{
		path: '', component: DimeComponent, children: [
			{ path: '', component: DimedashboardComponent, canActivate: [AuthGuard] },
			{ path: 'tags', loadChildren: () => import('app/admin/dimetag/dimetag.module').then(m => m.DimeTagModule) },
			{ path: 'environments', loadChildren: () => import('app/admin/dimeenvironment/dimeenvironment.module').then(m => m.DimeEnvironmentModule) },
			{ path: 'credentials', loadChildren: () => import('app/admin/dimecredential/dimecredential.module').then(m => m.DimeCredentialModule) },
			{ path: 'streams', loadChildren: () => import('app/admin/dimestream/dimestream.module').then(m => m.DimestreamModule) },
			{ path: 'maps', loadChildren: () => import('app/admin/dimemap/dimemap.module').then(m => m.DimemapModule) },
			{ path: 'matrices', loadChildren: () => import('app/admin/dimematrix/dimematrix.module').then(m => m.DimematrixModule) },
			{ path: 'processes', loadChildren: () => import('app/admin/dimeprocess/dimeprocess.module').then(m => m.DimeprocessModule) },
			{ path: 'schedules', loadChildren: () => import('app/admin/dimeschedule/dimeschedule.module').then(m => m.DimescheduleModule) },
			{ path: 'asyncprocesses', loadChildren: () => import('app/admin/dimeasyncprocess/dimeasyncprocess.module').then(m => m.DimeAsyncProcessModule) },
			{ path: 'settings', loadChildren: () => import('app/admin/dimesettings/dimesettings.module').then(m => m.DimeSettingsModule) },
			{ path: 'secrets', loadChildren: () => import('app/admin/dimesecret/dimesecret.module').then(m => m.DimeSecretModule) },
			{ path: 'users', loadChildren: () => import('app/admin/users/users.module').then(m => m.UsersModule) },
			{ path: 'directories', loadChildren: () => import('app/admin/directories/directories.module').then(m => m.DirectoriesModule) },
		]
	}
];

@NgModule( {
	imports: [
		CommonModule,
		FormsModule,
		RouterModule.forChild( routes ),
		ModalModule,
		BsDropdownModule
	],
	declarations: [
		DimeComponent,
		DimemenuComponent,
		DimedashboardComponent,
	]
} )
export class AdminModule { }
