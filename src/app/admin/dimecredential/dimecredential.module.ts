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
import { CentralModule } from '../../central/central.module';

const dimeCredentialRoutes: Routes = [
	{
		path: '', component: DimeCredentialsComponent, children: [
			{ path: '', component: DimeCredentialListComponent },
			{ path: ':id', component: DimeCredentialDetailComponent }
		]
	}
];

@NgModule( {
	imports: [
		CommonModule,
		FormsModule,
		RouterModule.forChild( dimeCredentialRoutes ),
		AuthModule,
		CentralModule
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
