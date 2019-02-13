import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from '../auth/auth-guard.service';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessmanagementComponent } from './accessmanagement/accessmanagement.component';
import { AccessmanagementmenuComponent } from './accessmanagementmenu/accessmanagementmenu.component';
import { AccessmanagementdashboardComponent } from './accessmanagementdashboard/accessmanagementdashboard.component';

import { AcmServerModule } from './acmserver/acmserver.module';
import { AcmUserModule } from './acmuser/acmuser.module';

import { AcmServersComponent } from './acmserver/acmservers/acmservers.component';
import { AcmUsersComponent } from './acmuser/acmusers/acmusers.component';

const acmRoutes: Routes = [
	{
		path: 'accessmanagement', component: AccessmanagementComponent, children: [
			{ path: '', component: AccessmanagementdashboardComponent, canActivate: [AuthGuard] },
			{ path: 'users', component: AcmUsersComponent, loadChildren: 'app/accessmanagement/acmuser/acmuser.module#AcmUserModule' },
			// { path: 'groups', component: AcmGroupsComponent, loadChildren: 'app/accessmanagement/group/group.module#GroupModule' },
			{ path: 'servers', component: AcmServersComponent, loadChildren: 'app/accessmanagement/acmserver/acmserver.module#AcmServerModule' }
		]
	}
];

@NgModule( {
	imports: [
		CommonModule,
		AcmServerModule,
		AcmUserModule,
		RouterModule.forChild( acmRoutes ),
		AuthModule
	],
	declarations: [
		AccessmanagementComponent,
		AccessmanagementmenuComponent,
		AccessmanagementdashboardComponent
	]
} )
export class AccessManagementModule { }
