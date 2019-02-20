import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users/users.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CentralModule } from '../../central/central.module';

const routes: Routes = [
	{
		path: '', component: UsersComponent, children: [
			{ path: '', component: UserListComponent },
			{ path: ':id', component: UserDetailComponent }
		]
	}
];

@NgModule( {
	declarations: [UsersComponent, UserListComponent, UserDetailComponent],
	imports: [
		CommonModule,
		FormsModule,
		RouterModule.forChild( routes ),
		CentralModule
	]
} )
export class UsersModule { }
