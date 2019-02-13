import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DimeCredentialsComponent } from './dimecredentials/dimecredentials.component';
import { DimeCredentialToolbarComponent } from './dimecredential-toolbar/dimecredential-toolbar.component';
import { DimeCredentialListComponent } from './dimecredential-list/dimecredential-list.component';
import { DimeCredentialDetailComponent } from './dimecredential-detail/dimecredential-detail.component';
import { DimeCredentialComponent } from './dimecredential/dimecredential.component';
import { AuthModule } from '../../auth/auth.module';

const dimeCredentialRoutes: Routes = [
	{
		path: '', component: DimeCredentialsComponent, children: [
			{ path: '', pathMatch: 'full', redirectTo: 'credential-list' },
			{ path: 'credential-list', component: DimeCredentialListComponent },
			{ path: 'credential-detail/:id', component: DimeCredentialDetailComponent }
		]
	}
];

@NgModule( {
	imports: [
		CommonModule,
		FormsModule,
		RouterModule.forChild( dimeCredentialRoutes ),
		AuthModule
	],
	exports: [
		RouterModule
	],
	declarations: [
		DimeCredentialsComponent,
		DimeCredentialToolbarComponent,
		DimeCredentialListComponent,
		DimeCredentialDetailComponent,
		DimeCredentialComponent
	]
} )
export class DimeCredentialModule { }
