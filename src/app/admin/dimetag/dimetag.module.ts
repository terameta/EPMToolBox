import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DimeTagsComponent } from './dimetags/dimetags.component';
import { DimeTagToolbarComponent } from './dimetag-toolbar/dimetag-toolbar.component';
import { DimeTagListComponent } from './dimetag-list/dimetag-list.component';
import { DimeTagDetailComponent } from './dimetag-detail/dimetag-detail.component';
import { DimeTagComponent } from './dimetag/dimetag.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { DimeTagGroupListComponent } from './dimetaggroup-list/dimetaggroup-list.component';
import { DimeTagsinGroupComponent } from './dimetagsingroup/dimetagsingroup.component';
import { AuthModule } from '../../auth/auth.module';

const dimeTagRoutes: Routes = [
	{
		path: '', component: DimeTagsComponent, children: [
			{ path: '', pathMatch: 'full', redirectTo: 'tag-list' },
			{
				path: 'tag-list', component: DimeTagListComponent, children: [
					{ path: '', pathMatch: 'prefix', redirectTo: 'group-list' },
					{ path: 'group-list', component: DimeTagGroupListComponent },
					{ path: ':id', component: DimeTagsinGroupComponent }
				]
			},
			{ path: 'tag-detail/:id', component: DimeTagDetailComponent }
		]
	}
];

@NgModule( {
	imports: [
		CommonModule,
		FormsModule,
		RouterModule.forChild( dimeTagRoutes ),
		AuthModule
	],
	exports: [
		RouterModule
	],
	declarations: [
		DimeTagsComponent,
		DimeTagToolbarComponent,
		DimeTagListComponent,
		DimeTagDetailComponent,
		DimeTagComponent,
		DimeTagGroupListComponent,
		DimeTagsinGroupComponent
	]
} )
export class DimeTagModule { }
