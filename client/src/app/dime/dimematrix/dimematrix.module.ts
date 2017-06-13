import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { HotTableModule } from 'ng2-handsontable';

import { AuthModule } from '../../welcome/auth.module';

import { DimematricesComponent } from './dimematrices/dimematrices.component';
import { DimematrixToolbarComponent } from './dimematrix-toolbar/dimematrix-toolbar.component';
import { DimematrixListComponent } from './dimematrix-list/dimematrix-list.component';
import { DimematrixDetailComponent } from './dimematrix-detail/dimematrix-detail.component';
import { DimematrixComponent } from './dimematrix/dimematrix.component';

const dimeMatrixRoutes: Routes = [
	{ path: 'dime/matrices', pathMatch: 'prefix', redirectTo: 'dime/matrices/matrix-list' },
	{ path: 'matrix-list', component: DimematrixListComponent },
	{ path: 'matrix-detail/:id', component: DimematrixDetailComponent }
]

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		RouterModule.forChild(dimeMatrixRoutes),
		AuthModule,
		HotTableModule
	],
	exports: [
		RouterModule
	],
	declarations: [
		DimematricesComponent,
		DimematrixToolbarComponent,
		DimematrixListComponent,
		DimematrixDetailComponent,
		DimematrixComponent
	]
})
export class DimematrixModule { }
