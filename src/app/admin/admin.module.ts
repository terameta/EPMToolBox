import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth-guard.service';

import { DimeComponent } from './dime/dime.component';
import { DimemenuComponent } from './dimemenu/dimemenu.component';
import { DimedashboardComponent } from './dimedashboard/dimedashboard.component';

const routes: Routes = [
	{
		path: '', component: DimeComponent, children: [
			{ path: '', component: DimedashboardComponent, canActivate: [AuthGuard] },
			{ path: 'tags', loadChildren: 'app/admin/dimetag/dimetag.module#DimeTagModule' },
			{ path: 'environments', loadChildren: 'app/admin/dimeenvironment/dimeenvironment.module#DimeEnvironmentModule' },
			{ path: 'credentials', loadChildren: 'app/admin/dimecredential/dimecredential.module#DimeCredentialModule' },
			{ path: 'streams', loadChildren: 'app/admin/dimestream/dimestream.module#DimestreamModule' },
			{ path: 'maps', loadChildren: 'app/admin/dimemap/dimemap.module#DimemapModule' },
			{ path: 'matrices', loadChildren: 'app/admin/dimematrix/dimematrix.module#DimematrixModule' },
			{ path: 'processes', loadChildren: 'app/admin/dimeprocess/dimeprocess.module#DimeprocessModule' },
			{ path: 'schedules', loadChildren: 'app/admin/dimeschedule/dimeschedule.module#DimescheduleModule' },
			// { path: 'asyncprocesses', component: DimeAsyncProcessesComponent, loadChildren: 'app/admin/dimeasyncprocess/dimeasyncprocess.module#DimeAsyncProcessModule' },
			// { path: 'settings', component: DimesettingsComponent, loadChildren: 'app/admin/dimesettings/dimesettings.module#DimeSettingsModule' },
			// { path: 'secrets', component: DimeSecretsComponent, loadChildren: 'app/admin/dimesecret/dimesecret.module#DimeSecretModule' }
		]
	}
];

@NgModule( {
	imports: [
		CommonModule,
		FormsModule,
		RouterModule.forChild( routes ),
	],
	exports: [],
	declarations: [
		DimeComponent,
		DimemenuComponent,
		DimedashboardComponent
	]
} )
export class AdminModule { }
