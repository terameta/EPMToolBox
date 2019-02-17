import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DimesettingsComponent } from './dimesettings/dimesettings.component';
import { DimesettingsToolbarComponent } from './dimesettings-toolbar/dimesettings-toolbar.component';
import { Routes, RouterModule } from '@angular/router';
import { DimesettingsMailserverComponent } from './dimesettings-mailserver/dimesettings-mailserver.component';
import { FormsModule } from '@angular/forms';
import { DimesettingsSystemadminComponent } from './dimesettings-systemadmin/dimesettings-systemadmin.component';

const dimeSettingsRoutes: Routes = [
	{
		path: '', component: DimesettingsComponent, children: [
			{ path: '', pathMatch: 'full', redirectTo: 'systemadmin' },
			{ path: 'systemadmin', component: DimesettingsSystemadminComponent },
			{ path: 'mailserver', component: DimesettingsMailserverComponent }
		]
	}
];


@NgModule( {
	imports: [
		CommonModule,
		FormsModule,
		RouterModule.forChild( dimeSettingsRoutes ),
	],
	declarations: [
		DimesettingsComponent,
		DimesettingsToolbarComponent,
		DimesettingsMailserverComponent,
		DimesettingsSystemadminComponent
	]
} )
export class DimeSettingsModule { }
