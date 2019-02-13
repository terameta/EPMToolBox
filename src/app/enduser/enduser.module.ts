import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from '../auth/auth-guard.service';

import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EndUserScreenComponent } from './enduserscreen/enduserscreen.component';
import { EnduserMenuComponent } from './enduser-menu/enduser-menu.component';
import { EnduserDimeComponent } from './enduser-dime/enduser-dime.component';
import { EndUsersComponent } from './endusers/endusers.component';

const endUserRoutes: Routes = [
	{
		path: 'enduser', component: EndUsersComponent, children: [
			{ path: '', component: EndUserScreenComponent, canActivate: [AuthGuard] },
			{ path: 'dime', component: EnduserDimeComponent }
		]
	}
];

@NgModule( {
	imports: [
		CommonModule,
		RouterModule.forChild( endUserRoutes ),
		AuthModule
	],
	declarations: [EndUserScreenComponent, EnduserMenuComponent, EnduserDimeComponent, EndUsersComponent]
} )
export class EndUserModule { }
