import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { DimeSecretListComponent } from './dimesecret-list/dimesecret-list.component';
import { DimeSecretToolbarComponent } from './dimesecret-toolbar/dimesecret-toolbar.component';
import { DimeSecretDetailComponent } from './dimesecret-detail/dimesecret-detail.component';
import { AuthModule } from '../../auth/auth.module';
import { DimeSecretsComponent } from './dimesecrets/dimesecrets.component';

const dimeSecretRoutes: Routes = [
	{ path: 'dime/secrets', pathMatch: 'prefix', redirectTo: 'dime/secrets/secret-list' },
	{ path: 'secret-list', component: DimeSecretListComponent },
	{ path: 'secret-detail/:id', component: DimeSecretDetailComponent }
];

@NgModule( {
	imports: [
		CommonModule,
		FormsModule,
		RouterModule.forChild( dimeSecretRoutes ),
		AuthModule
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
