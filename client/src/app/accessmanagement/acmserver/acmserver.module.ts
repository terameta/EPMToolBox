import { AuthModule } from '../../welcome/auth.module';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcmServerComponent } from './acmserver/acmserver.component';
import { AcmServersComponent } from './acmservers/acmservers.component';
import { AcmServerListComponent } from './acmserver-list/acmserver-list.component';
import { AcmServerDetailComponent } from './acmserver-detail/acmserver-detail.component';
import { AcmServerToolbarComponent } from './acmserver-toolbar/acmserver-toolbar.component';

const acmServerRoutes: Routes = [
	{ path: 'accessmanagement/servers', pathMatch: 'prefix', redirectTo: 'accessmanagement/servers/server-list' },
	{ path: 'server-list', component: AcmServerListComponent },
	{ path: 'server-detail/:id', component: AcmServerDetailComponent }
]

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		RouterModule.forChild(acmServerRoutes),
		AuthModule
	],
	exports: [
		RouterModule
	],
	declarations: [
		AcmServerComponent,
		AcmServersComponent,
		AcmServerListComponent,
		AcmServerDetailComponent,
		AcmServerToolbarComponent
	]
})
export class AcmServerModule { }
