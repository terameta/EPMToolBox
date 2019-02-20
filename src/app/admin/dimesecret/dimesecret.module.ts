import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { DimeSecretListComponent } from './dimesecret-list/dimesecret-list.component';
import { DimeSecretToolbarComponent } from './dimesecret-toolbar/dimesecret-toolbar.component';
import { DimeSecretDetailComponent } from './dimesecret-detail/dimesecret-detail.component';
import { AuthModule } from '../../auth/auth.module';
import { DimeSecretsComponent } from './dimesecrets/dimesecrets.component';
import { CentralModule } from '../../central/central.module';

const dimeSecretRoutes: Routes = [
	{
		path: '', component: DimeSecretsComponent, children: [
			{ path: '', component: DimeSecretListComponent },
			{ path: ':id', component: DimeSecretDetailComponent }]
	}
];

@NgModule( {
	imports: [
		CommonModule,
		FormsModule,
		RouterModule.forChild( dimeSecretRoutes ),
		AuthModule,
		CentralModule
	],
	exports: [
		RouterModule
	],
	declarations: [
		DimeSecretListComponent,
		DimeSecretToolbarComponent,
		DimeSecretDetailComponent,
		DimeSecretsComponent
	]
} )
export class DimeSecretModule { }
