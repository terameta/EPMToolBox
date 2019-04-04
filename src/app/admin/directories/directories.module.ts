import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirectoriesComponent } from './directories/directories.component';
import { DirectoryListComponent } from './directory-list/directory-list.component';
import { DirectoryDetailComponent } from './directory-detail/directory-detail.component';
import { DirectoryDetailsComponent } from './directory-details/directory-details.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
	{
		path: '', component: DirectoriesComponent, children: [
			{ path: '', component: DirectoryListComponent },
			{ path: ':id', component: DirectoryDetailComponent }
		]
	}
];

@NgModule( {
	declarations: [DirectoriesComponent, DirectoryListComponent, DirectoryDetailComponent, DirectoryDetailsComponent],
	imports: [
		CommonModule,
		FormsModule,
		RouterModule.forChild( routes )
	]
} )
export class DirectoriesModule { }
