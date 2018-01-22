import { FormsModule } from '@angular/forms';
import { AuthModule } from '../welcome/auth.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, CanActivate } from '@angular/router';

import { AuthGuard } from '../welcome/auth-guard.service';

import { DimeComponent } from './dime/dime.component';
import { DimemenuComponent } from './dimemenu/dimemenu.component';

import { DimeprocessesComponent } from './dimeprocess/dimeprocesses/dimeprocesses.component';
import { DimeschedulesComponent } from './dimeschedule/dimeschedules/dimeschedules.component';
import { DimeenvironmentsComponent } from './dimeenvironment/dimeenvironments/dimeenvironments.component';
import { DimeStreamsComponent } from './dimestream/dimestreams/dimestreams.component';
import { DimemapsComponent } from './dimemap/dimemaps/dimemaps.component';
import { DimeMatricesComponent } from './dimematrix/dimematrices/dimematrices.component';
import { DimeAsyncProcessesComponent } from './dimeasyncprocess/dimeasyncprocesses/dimeasyncprocesses.component';

import { DimeCredentialModule } from './dimecredential/dimecredential.module';
import { DimescheduleModule } from './dimeschedule/dimeschedule.module';
import { DimeprocessModule } from './dimeprocess/dimeprocess.module';
import { DimeEnvironmentModule } from './dimeenvironment/dimeenvironment.module';
import { DimestreamModule } from './dimestream/dimestream.module';
import { DimemapModule } from './dimemap/dimemap.module';
import { DimematrixModule } from './dimematrix/dimematrix.module';
import { DimeAsyncProcessModule } from './dimeasyncprocess/dimeasyncprocess.module';

import { DimedashboardComponent } from './dimedashboard/dimedashboard.component';
import { DimeCredentialsComponent } from './dimecredential/dimecredentials/dimecredentials.component';
import { DimeTagsComponent } from './dimetag/dimetags/dimetags.component';
import { DimeTagModule } from './dimetag/dimetag.module';



const dimeRoutes: Routes = [
	{
		path: 'dime', component: DimeComponent, children: [
			{ path: '', component: DimedashboardComponent, canActivate: [AuthGuard] },
			{ path: 'tags', component: DimeTagsComponent, loadChildren: 'app/dime/dimetag/dimetag.module#DimeTagModule' },
			{ path: 'credentials', component: DimeCredentialsComponent, loadChildren: 'app/dime/dimecredential/dimecredential.module#DimeCredentialModule' },
			{ path: 'schedules', component: DimeschedulesComponent, loadChildren: 'app/dime/dimeschedule/dimeschedule.module#DimescheduleModule' },
			{ path: 'processes', component: DimeprocessesComponent, loadChildren: 'app/dime/dimeprocess/dimeprocess.module#DimeprocessModule' },
			{ path: 'environments', component: DimeenvironmentsComponent, loadChildren: 'app/dime/dimeenvironment/dimeenvironment.module#DimeEnvironmentModule' },
			{ path: 'streams', component: DimeStreamsComponent, loadChildren: 'app/dime/dimestream/dimestream.module#DimestreamModule' },
			{ path: 'maps', component: DimemapsComponent, loadChildren: 'app/dime/dimemap/dimemap.module#DimemapModule' },
			{ path: 'matrices', component: DimeMatricesComponent, loadChildren: 'app/dime/dimematrix/dimematrix.module#DimematrixModule' },
			{ path: 'asyncprocesses', component: DimeAsyncProcessesComponent, loadChildren: 'app/dime/dimeasyncprocess/dimeasyncprocess.module#DimeAsyncProcessModule' }
		]
	}
];

@NgModule( {
	imports: [
		CommonModule,
		FormsModule,
		DimeTagModule,
		DimeCredentialModule,
		DimeprocessModule,
		DimescheduleModule,
		DimeEnvironmentModule,
		DimestreamModule,
		DimemapModule,
		DimematrixModule,
		DimeAsyncProcessModule,
		RouterModule.forChild( dimeRoutes ),
		AuthModule
	],
	exports: [
		RouterModule
	],
	declarations: [
		DimeComponent,
		DimemenuComponent,
		DimedashboardComponent
	]
} )
export class DimeModule { }
